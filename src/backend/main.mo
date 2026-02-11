import List "mo:core/List";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";

import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  type Id = Text;

  type Class = {
    id : Id;
    name : Text;
    description : Text;
    active : Bool;
  };

  module Class {
    public func compare(class1 : Class, class2 : Class) : Order.Order {
      Text.compare(class1.name, class2.name);
    };
  };

  type Course = {
    id : Id;
    classId : Id;
    name : Text;
    description : Text;
    active : Bool;
  };

  type Student = {
    id : Id;
    principal : Principal;
    firstName : Text;
    lastName : Text;
    classId : Id;
    courseId : ?Id;
    active : Bool;
  };

  type Teacher = {
    id : Id;
    principal : Principal;
    firstName : Text;
    lastName : Text;
    active : Bool;
  };

  module Student {
    public func compare(student1 : Student, student2 : Student) : Order.Order {
      Text.compare(student1.lastName, student2.lastName);
    };
  };

  type VideoSource = {
    #uploaded;
    #external;
  };

  type Lesson = {
    id : Id;
    title : Text;
    description : Text;
    classId : Id;
    courseId : ?Id;
    videoSource : VideoSource;
    videoUrl : Text;
    active : Bool;
  };

  type LessonProgress = {
    lessonId : Id;
    completed : Bool;
    completionTimestamp : ?Int;
  };

  public type UserProfile = {
    name : Text;
    role : Text;
  };

  //- Subscription state
  type SubscriptionConfig = {
    paywallEnabled : Bool;
    priceSatoshis : Nat;
    qrImage : Storage.ExternalBlob;
  };

  public type SubscriptionRecord = {
    studentPrincipal : Principal;
    classId : Id;
    paymentTimestamp : Time.Time;
  };

  let classes = Map.empty<Id, Class>();
  let courses = Map.empty<Id, Course>();
  let students = Map.empty<Id, Student>();
  let teachers = Map.empty<Id, Teacher>();
  let lessons = Map.empty<Id, Lesson>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let lessonProgress = Map.empty<Principal, Map.Map<Id, LessonProgress>>();
  let subscriptionConfigs = Map.empty<Id, SubscriptionConfig>();
  let subscriptions = Map.empty<Principal, Map.Map<Id, SubscriptionRecord>>();

  // --- Authorization ---
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // --- Helper Functions ---
  private func getStudentByPrincipal(principal : Principal) : ?Student {
    for (student in students.values()) {
      if (Principal.equal(student.principal, principal)) {
        return ?student;
      };
    };
    null;
  };

  private func getTeacherByPrincipal(principal : Principal) : ?Teacher {
    for (teacher in teachers.values()) {
      if (Principal.equal(teacher.principal, principal)) {
        return ?teacher;
      };
    };
    null;
  };

  // Check if caller is admin or teacher
  private func isAdminOrTeacher(caller : Principal) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    switch (getTeacherByPrincipal(caller)) {
      case (?_) { true };
      case (null) { false };
    };
  };

  // Checks if a student has an active subscription for a specific class
  private func hasActiveSubscription(studentPrincipal : Principal, classId : Id) : Bool {
    switch (subscriptions.get(studentPrincipal)) {
      case (?classMap) { classMap.containsKey(classId) };
      case (null) { false };
    };
  };

  private func studentHasAccessToLesson(student : Student, lesson : Lesson) : Bool {
    // Lesson must match student's class
    if (lesson.classId != student.classId) { return false };

    // Check course access
    switch (student.courseId, lesson.courseId) {
      case (?studentCourse, ?lessonCourse) {
        studentCourse == lessonCourse;
      };
      case (?studentCourse, null) {
        // Course-agnostic lesson, available to student
        true;
      };
      case (null, ?lessonCourse) {
        // Student has no course, can't access course-specific lesson
        false;
      };
      case (null, null) {
        true;
      };
    };
  };

  // Check if paywall is enabled for a class and if student needs subscription
  private func requiresSubscription(classId : Id, studentPrincipal : Principal, lessonIndex : Nat) : Bool {
    switch (subscriptionConfigs.get(classId)) {
      case (?config) {
        if (not config.paywallEnabled) {
          return false; // Paywall disabled, no subscription needed
        };
        // Paywall enabled: check if student has subscription
        if (hasActiveSubscription(studentPrincipal, classId)) {
          return false; // Has subscription, no blocking
        };
        // No subscription: block if beyond first 2 lessons (index >= 2)
        return lessonIndex >= 2;
      };
      case (null) {
        // No config means no paywall
        return false;
      };
    };
  };

  // Get lessons for a class sorted consistently (for indexing)
  private func getSortedLessonsForClass(classId : Id, courseId : ?Id) : [Lesson] {
    let filtered = lessons.values().toArray().filter(func(l) {
      l.classId == classId and (
        switch (courseId) {
          case (?cid) { l.courseId == ?cid };
          case (null) { true };
        }
      )
    });
    // Sort by lesson id for consistent ordering
    filtered.sort(func(a : Lesson, b : Lesson) : Order.Order {
      Text.compare(a.id, b.id);
    });
  };

  // --- User Profile Management ---
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // --- Class Management ---
  public shared ({ caller }) func createClass(name : Text, description : Text) : async Id {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create classes");
    };
    let id = name;
    if (classes.containsKey(id)) { Runtime.trap("Class already exists") };
    let classInstance = {
      id;
      name;
      description;
      active = true;
    };
    classes.add(id, classInstance);
    id;
  };

  public query ({ caller }) func getClasses() : async [Class] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view classes");
    };
    classes.values().toArray();
  };

  // --- Subscription Management ---
  public type GetSubscriptionConfig = {
    paywallEnabled : Bool;
    priceSatoshis : Nat;
    qrImage : ?Storage.ExternalBlob;
  };

  public query ({ caller }) func getClassSubscriptionConfig(classId : Id) : async ?GetSubscriptionConfig {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view subscription config");
    };
    switch (subscriptionConfigs.get(classId)) {
      case (?config) {
        ?{
          paywallEnabled = config.paywallEnabled;
          priceSatoshis = config.priceSatoshis;
          qrImage = ?config.qrImage;
        };
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func setClassSubscriptionConfig(
    classId : Id,
    paywallEnabled : Bool,
    priceSatoshis : Nat,
    qrImage : Storage.ExternalBlob,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure subscriptions");
    };

    let config = {
      paywallEnabled;
      priceSatoshis;
      qrImage;
    };
    subscriptionConfigs.add(classId, config);
  };

  public query ({ caller }) func hasClassSubscription(studentId : Id, classId : Id) : async Bool {
    // Allow students to check their own subscription status
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check subscription status");
    };

    // Students can only check their own subscription, admins/teachers can check any
    if (not isAdminOrTeacher(caller)) {
      switch (getStudentByPrincipal(caller)) {
        case (?student) {
          if (student.id != studentId) {
            Runtime.trap("Unauthorized: Can only check your own subscription status");
          };
        };
        case (null) {
          Runtime.trap("Student profile not found");
        };
      };
    };

    let student = switch (students.get(studentId)) {
      case (?student) { student };
      case (null) { return false };
    };

    switch (subscriptions.get(student.principal)) {
      case (?classMap) {
        classMap.containsKey(classId);
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func activateClassSubscription(studentId : Id, classId : Id) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can activate subscriptions");
    };

    // Get the actual student to retrieve their principal
    let student = switch (students.get(studentId)) {
      case (?s) { s };
      case (null) {
        Runtime.trap("Student does not exist");
      };
    };

    // Verify class exists
    if (not classes.containsKey(classId)) {
      Runtime.trap("Class does not exist");
    };

    let record = {
      studentPrincipal = student.principal;
      classId;
      paymentTimestamp = Time.now();
    };

    let classMap = switch (subscriptions.get(student.principal)) {
      case (?map) { map };
      case (null) {
        let newMap = Map.empty<Id, SubscriptionRecord>();
        subscriptions.add(student.principal, newMap);
        newMap;
      };
    };
    classMap.add(classId, record);
  };

  // --- Course Management ---
  public shared ({ caller }) func createCourse(classId : Id, name : Text, description : Text) : async Id {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create courses");
    };
    if (not classes.containsKey(classId)) { Runtime.trap("Class does not exist") };
    let id = name;
    if (courses.containsKey(id)) { Runtime.trap("Course already exists") };
    let course = {
      id;
      classId;
      name;
      description;
      active = true;
    };
    courses.add(id, course);
    id;
  };

  public query ({ caller }) func getCourses(classId : ?Id) : async [Course] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view courses");
    };

    // If student, filter to their class only
    if (not isAdminOrTeacher(caller)) {
      switch (getStudentByPrincipal(caller)) {
        case (?student) {
          courses.values().toArray().filter(func(c) {
            c.classId == student.classId and (
              switch (classId) {
                case (?id) { id == student.classId };
                case (null) { true };
              }
            )
          });
        };
        case (null) {
          Runtime.trap("Student profile not found");
        };
      };
    } else {
      // Admin/Teacher can see all courses
      switch (classId) {
        case (?id) {
          courses.values().toArray().filter(func(c) { c.classId == id });
        };
        case (null) { courses.values().toArray() };
      };
    };
  };

  // --- Lesson Management ---
  public shared ({ caller }) func createLesson(
    title : Text,
    description : Text,
    classId : Id,
    courseId : ?Id,
    videoSource : VideoSource,
    videoUrl : Text,
  ) : async Id {
    if (not isAdminOrTeacher(caller)) {
      Runtime.trap("Unauthorized: Only admins and teachers can create lessons");
    };
    if (not classes.containsKey(classId)) { Runtime.trap("Class does not exist") };
    let id = title;
    if (lessons.containsKey(id)) { Runtime.trap("Lesson already exists") };
    let lesson = {
      id;
      title;
      description;
      classId;
      courseId;
      videoSource;
      videoUrl;
      active = true;
    };
    lessons.add(id, lesson);
    id;
  };

  public query ({ caller }) func getLessons(classId : ?Id, courseId : ?Id) : async [Lesson] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view lessons");
    };

    // If student, apply subscription-based filtering
    if (not isAdminOrTeacher(caller)) {
      switch (getStudentByPrincipal(caller)) {
        case (?student) {
          // Get all lessons the student has class/course access to
          let accessibleLessons = lessons.values().toArray().filter(func(l) {
            studentHasAccessToLesson(student, l)
          });

          // Sort lessons by class to apply paywall per class
          let sortedLessons = accessibleLessons.sort(func(a : Lesson, b : Lesson) : Order.Order {
            let classCompare = Text.compare(a.classId, b.classId);
            if (classCompare != #equal) {
              return classCompare;
            };
            Text.compare(a.id, b.id);
          });

          // Apply paywall filtering
          let filteredLessons = List.empty<Lesson>();
          var currentClassId : ?Id = null;
          var classLessonIndex : Nat = 0;

          for (lesson in sortedLessons.vals()) {
            // Reset index when we encounter a new class
            switch (currentClassId) {
              case (?cid) {
                if (cid != lesson.classId) {
                  currentClassId := ?lesson.classId;
                  classLessonIndex := 0;
                };
              };
              case (null) {
                currentClassId := ?lesson.classId;
                classLessonIndex := 0;
              };
            };

            // Check if this lesson requires subscription
            if (requiresSubscription(lesson.classId, caller, classLessonIndex)) {
              // Blocked by paywall - skip this lesson
            } else {
              filteredLessons.add(lesson);
            };

            classLessonIndex += 1;
          };

          filteredLessons.toArray();
        };
        case (null) {
          Runtime.trap("Student profile not found");
        };
      };
    } else {
      // Admin/Teacher can filter as requested (no paywall restrictions)
      lessons.values().toArray().filter(func(l) {
        switch (classId, courseId) {
          case (null, null) { true };
          case (?cid, null) { l.classId == cid };
          case (?cid, ?crsid) { l.classId == cid and l.courseId == ?crsid };
          case (null, ?crsid) {
            switch (l.courseId) {
              case (?id) { id == crsid };
              case (_) { false };
            };
          };
        };
      });
    };
  };

  // --- Student Management ---
  public shared ({ caller }) func registerStudent(
    studentPrincipal : Principal,
    firstName : Text,
    lastName : Text,
    classId : Id,
    courseId : ?Id
  ) : async Id {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can register students");
    };
    if (not classes.containsKey(classId)) { Runtime.trap("Class does not exist") };
    let id = studentPrincipal.toText();
    if (students.containsKey(id)) { Runtime.trap("Student already exists") };
    let student = {
      id;
      principal = studentPrincipal;
      firstName;
      lastName;
      classId;
      courseId;
      active = true;
    };
    students.add(id, student);

    // Assign user role to the student principal
    AccessControl.assignRole(accessControlState, caller, studentPrincipal, #user);

    id;
  };

  public query ({ caller }) func getStudents(classId : ?Id, courseId : ?Id) : async [Student] {
    if (not isAdminOrTeacher(caller)) {
      Runtime.trap("Unauthorized: Only admins and teachers can view student lists");
    };
    students.values().toArray().filter(func(s) {
      switch (classId, courseId) {
        case (null, null) { true };
        case (?cid, null) { s.classId == cid };
        case (?cid, ?crsid) { s.classId == cid and s.courseId == ?crsid };
        case (null, ?crsid) {
          switch (s.courseId) {
            case (?id) { id == crsid };
            case (_) { false };
          };
        };
      };
    });
  };

  public query ({ caller }) func getMyStudentProfile() : async ?Student {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their profile");
    };
    getStudentByPrincipal(caller);
  };

  // --- Teacher Management ---
  public shared ({ caller }) func registerTeacher(
    teacherPrincipal : Principal,
    firstName : Text,
    lastName : Text
  ) : async Id {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can register teachers");
    };
    let id = teacherPrincipal.toText();
    if (teachers.containsKey(id)) { Runtime.trap("Teacher already exists") };
    let teacher = {
      id;
      principal = teacherPrincipal;
      firstName;
      lastName;
      active = true;
    };
    teachers.add(id, teacher);

    // Assign user role to the teacher principal (teachers are users with additional privileges)
    AccessControl.assignRole(accessControlState, caller, teacherPrincipal, #user);

    id;
  };

  public query ({ caller }) func getTeachers() : async [Teacher] {
    if (not isAdminOrTeacher(caller)) {
      Runtime.trap("Unauthorized: Only admins and teachers can view teacher lists");
    };
    teachers.values().toArray();
  };

  public query ({ caller }) func getMyTeacherProfile() : async ?Teacher {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their profile");
    };
    getTeacherByPrincipal(caller);
  };

  // --- Lesson Progress Tracking ---

  // Student updates progress for a lesson (completion, timestamp, etc.)
  public shared ({ caller }) func updateLessonProgress(lessonId : Id, completed : Bool, completionTimestamp : ?Int) : async () {
    // Only authenticated users (students) can update their own progress
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update progress");
    };

    // Check if the lesson exists
    let lesson = switch (lessons.get(lessonId)) {
      case (?l) { l };
      case (null) {
        Runtime.trap("Lesson does not exist");
      };
    };

    // Verify student has access to this lesson (unless admin/teacher)
    if (not isAdminOrTeacher(caller)) {
      switch (getStudentByPrincipal(caller)) {
        case (?student) {
          if (not studentHasAccessToLesson(student, lesson)) {
            Runtime.trap("Unauthorized: You do not have access to this lesson");
          };
        };
        case (null) {
          Runtime.trap("Student profile not found");
        };
      };
    };

    // Get or create the student's progress map
    let studentMap = switch (lessonProgress.get(caller)) {
      case (?map) { map };
      case (null) {
        let newMap = Map.empty<Id, LessonProgress>();
        lessonProgress.add(caller, newMap);
        newMap;
      };
    };

    // Update the lesson progress
    let lessonProgressRecord = {
      lessonId;
      completed;
      completionTimestamp;
    };
    studentMap.add(lessonId, lessonProgressRecord);
  };

  // Retrieve student's progress for a specific lesson
  public query ({ caller }) func getLessonProgress(lessonId : Id) : async ?LessonProgress {
    // Only authenticated users (students) can access their own progress
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access progress");
    };

    // Check if the lesson exists
    let lesson = switch (lessons.get(lessonId)) {
      case (?l) { l };
      case (null) {
        Runtime.trap("Lesson does not exist");
      };
    };

    // Verify student has access to this lesson (unless admin/teacher)
    if (not isAdminOrTeacher(caller)) {
      switch (getStudentByPrincipal(caller)) {
        case (?student) {
          if (not studentHasAccessToLesson(student, lesson)) {
            Runtime.trap("Unauthorized: You do not have access to this lesson");
          };
        };
        case (null) {
          Runtime.trap("Student profile not found");
        };
      };
    };

    switch (lessonProgress.get(caller)) {
      case (?studentMap) {
        studentMap.get(lessonId);
      };
      case (null) { null };
    };
  };

  // Retrieve all lesson progress for a student
  public query ({ caller }) func getAllProgressForStudent(studentPrincipal : Principal) : async [LessonProgress] {
    // Must be authenticated
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access progress");
    };

    // Only admins, teachers, or the student themselves can access this data
    if (
      not isAdminOrTeacher(caller) and not Principal.equal(caller, studentPrincipal)
    ) {
      Runtime.trap("Unauthorized: Only admins, teachers, or the student can access this data");
    };

    switch (lessonProgress.get(studentPrincipal)) {
      case (?studentMap) {
        studentMap.values().toArray();
      };
      case (null) { [] };
    };
  };

  // Retrieve progress for all lessons in a course for a student
  public query ({ caller }) func getCourseProgressForStudent(studentPrincipal : Principal, courseId : Id) : async [LessonProgress] {
    // Must be authenticated
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access progress");
    };

    // Only admins, teachers, or the student themselves can access this data
    if (
      not isAdminOrTeacher(caller) and not Principal.equal(caller, studentPrincipal)
    ) {
      Runtime.trap("Unauthorized: Only admins, teachers, or the student can access this data");
    };

    // Get all lessons for the course
    let courseLessons = lessons.values().toArray().filter(func(l) {
      l.courseId == ?courseId
    });

    // Get student's progress for those lessons
    switch (lessonProgress.get(studentPrincipal)) {
      case (?studentMap) {
        let progressOptions = courseLessons.map(
          func(lesson) {
            studentMap.get(lesson.id);
          }
        );
        let filteredProgress = progressOptions.filter(func(opt) { opt != null });
        let lessonProgressArray = filteredProgress.map(
          func(opt) {
            switch (opt) {
              case (?progress) { progress };
              case (null) {
                Runtime.trap("Unexpected null value in filtered options");
              };
            };
          }
        );
        lessonProgressArray;
      };
      case (null) { [] };
    };
  };

  // Retrieve all students' progress for a specific lesson/course
  public query ({ caller }) func getProgressForLesson(lessonId : Id) : async [(Principal, LessonProgress)] {
    // Only admins and teachers can access this data
    if (not isAdminOrTeacher(caller)) {
      Runtime.trap("Unauthorized: Only admins and teachers can access this data");
    };

    let progresses = List.empty<(Principal, LessonProgress)>();

    for ((studentPrincipal, studentMap) in lessonProgress.entries()) {
      switch (studentMap.get(lessonId)) {
        case (?progress) {
          progresses.add((studentPrincipal, progress));
        };
        case (null) {};
      };
    };
    progresses.toArray();
  };

  // Admin/Teacher can get progress for all students in a course
  public query ({ caller }) func getCourseProgress(courseId : Id) : async [(Principal, [LessonProgress])] {
    // Only admins and teachers can access this data
    if (not isAdminOrTeacher(caller)) {
      Runtime.trap("Unauthorized: Only admins and teachers can access this data");
    };

    let courseLessons = lessons.values().toArray().filter(func(l) {
      l.courseId == ?courseId
    });

    if (courseLessons.size() == 0) {
      return [];
    };

    let resultList = List.empty<(Principal, [LessonProgress])>();

    for ((studentPrincipal, studentMap) in lessonProgress.entries()) {
      // Only include students with some progress for this course
      let studentCourseProgress = List.empty<LessonProgress>();

      for (lesson in courseLessons.values()) {
        switch (studentMap.get(lesson.id)) {
          case (?progress) {
            studentCourseProgress.add(progress);
          };
          case (null) {};
        };
      };

      let progressArray = studentCourseProgress.toArray();
      if (progressArray.size() > 0) {
        resultList.add((studentPrincipal, progressArray));
      };
    };

    resultList.toArray();
  };
};
