import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LogInView from "@/views/LogInView.vue";
import SignUpView from "@/views/SignUpView.vue";
import ResetPasswordView from "@/views/ResetPasswordView.vue";
import ActivateAccountView from "@/views/ActivateAccountView.vue";
import ResetPasswordConfirmationView from "@/views/ResetPasswordConfirmationView.vue";
import CoursePage from "@/views/CoursePage.vue";
import CourseOverview from "@/views/CourseOverview.vue";
import VideoCard from "@/components/cards/VideoCard.vue";
import MyCourses from "@/views/MyCourses.vue";
import MyLearning from "@/views/MyLearning.vue";


const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LogInView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPasswordView,
  },
  {
    path: "/activate/:uid/:token",
    name: "ActivateAccount",
    component: ActivateAccountView,
  },
  {
    path: "/password/reset/confirm/:uid/:token",
    name: "ResetPasswordConfirm",
    component: ResetPasswordConfirmationView,
  },
  {
    path: "/courses/:id",
    component: CoursePage,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "course-overview",
        component: CourseOverview,
      },
      {
        path: "lessons/:lessonId",
        name: "course-lesson",
        component: VideoCard,
      },
    ],
  },
  {
    path: "/my-courses",
    name: "my-courses",
    component: MyCourses,
    meta: { requiresAuth: true },
  },
  {
    path: "/my-learning/:courseId",
    name: "my-learning",
    component: MyLearning,
    meta: { requiresAuth: true },
  },
  {
    path: "/checkout/:courseId",
    name: "checkout",
    component: () => import("@/views/Checkout.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/payment/success",
    name: "payment-success",
    component: () => import("@/views/PaymentSuccess.vue"),
  },
  {
    path: "/payment/cancel",
    name: "payment-cancel",
    component: () => import("@/views/PaymentCancel.vue"),
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("@/views/SearchPage.vue"),
    meta: { title: "Search Results" },
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("@/views/Contact.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("@/views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});


export default router;
