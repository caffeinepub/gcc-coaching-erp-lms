import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Class {
    id: Id;
    active: boolean;
    name: string;
    description: string;
}
export interface Teacher {
    id: Id;
    principal: Principal;
    active: boolean;
    lastName: string;
    firstName: string;
}
export interface Course {
    id: Id;
    active: boolean;
    name: string;
    description: string;
    classId: Id;
}
export interface GetSubscriptionConfig {
    priceSatoshis: bigint;
    qrImage?: ExternalBlob;
    paywallEnabled: boolean;
}
export interface Lesson {
    id: Id;
    title: string;
    active: boolean;
    description: string;
    classId: Id;
    videoSource: VideoSource;
    videoUrl: string;
    courseId?: Id;
}
export type Id = string;
export interface LessonProgress {
    lessonId: Id;
    completed: boolean;
    completionTimestamp?: bigint;
}
export interface UserProfile {
    name: string;
    role: string;
}
export interface Student {
    id: Id;
    principal: Principal;
    active: boolean;
    classId: Id;
    lastName: string;
    courseId?: Id;
    firstName: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VideoSource {
    uploaded = "uploaded",
    external = "external"
}
export interface backendInterface {
    activateClassSubscription(studentId: Id, classId: Id): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createClass(name: string, description: string): Promise<Id>;
    createCourse(classId: Id, name: string, description: string): Promise<Id>;
    createLesson(title: string, description: string, classId: Id, courseId: Id | null, videoSource: VideoSource, videoUrl: string): Promise<Id>;
    getAllProgressForStudent(studentPrincipal: Principal): Promise<Array<LessonProgress>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClassSubscriptionConfig(classId: Id): Promise<GetSubscriptionConfig | null>;
    getClasses(): Promise<Array<Class>>;
    getCourseProgress(courseId: Id): Promise<Array<[Principal, Array<LessonProgress>]>>;
    getCourseProgressForStudent(studentPrincipal: Principal, courseId: Id): Promise<Array<LessonProgress>>;
    getCourses(classId: Id | null): Promise<Array<Course>>;
    getLessonProgress(lessonId: Id): Promise<LessonProgress | null>;
    getLessons(classId: Id | null, courseId: Id | null): Promise<Array<Lesson>>;
    getMyStudentProfile(): Promise<Student | null>;
    getMyTeacherProfile(): Promise<Teacher | null>;
    getProgressForLesson(lessonId: Id): Promise<Array<[Principal, LessonProgress]>>;
    getStudents(classId: Id | null, courseId: Id | null): Promise<Array<Student>>;
    getTeachers(): Promise<Array<Teacher>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    hasClassSubscription(studentId: Id, classId: Id): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    registerStudent(studentPrincipal: Principal, firstName: string, lastName: string, classId: Id, courseId: Id | null): Promise<Id>;
    registerTeacher(teacherPrincipal: Principal, firstName: string, lastName: string): Promise<Id>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setClassSubscriptionConfig(classId: Id, paywallEnabled: boolean, priceSatoshis: bigint, qrImage: ExternalBlob): Promise<void>;
    updateLessonProgress(lessonId: Id, completed: boolean, completionTimestamp: bigint | null): Promise<void>;
}
