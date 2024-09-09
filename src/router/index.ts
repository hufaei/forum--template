import { createRouter, createWebHistory } from 'vue-router'


const SectionView = () => import('@/views/SectionView.vue')
const MainView = () => import('@/views/MainView.vue')
const TopicView = () => import('@/views/TopicView.vue')
const ProfileView = () => import('@/views/ProfileView.vue')
const EditProfileView = () => import('@/views/testView.vue') 
const RegisterView = () => import('@/views/RegisterView.vue')
const LoginView = () => import('@/views/LoginView.vue')
const HomeView = () => import('@/views/HomeView.vue')
const NotFoundView = () => import('@/views/NotFoundView.vue')
const PublishView = () => import('@/views/testView1.vue')
const MessageView = () => import('@/views/MessageView.vue')

const ChatRoom = () => import('@/components/message/ChatView.vue')
const ChatList = () => import('@/components/message/ChatList.vue')
const FollowingView = () => import('@/components/message/FollowingView.vue')
const ReceivedLikes = () => import('@/components/message/ReceivedLikes.vue')


const routes = [
  {
      path: "/",
      alias: ["/index", "/home"],
      name:"home",
      component: HomeView
  },
  {
      path: "/main",
      name: "main",
      component: MainView,
      children: [
          {
              path: "section",
              name: "section",
              component: SectionView
          },
          {
            
            path: "topic/:topicId",
            name: "topic",
            component: TopicView
          }
      ]
  },
  {
      path: "/register",
      name: "register",
      component: RegisterView
  },
  {
      path: "/login",
      name: "login",
      component: LoginView
  },
  {
      path: "/profile/:userId",
      name: "profile",
      component: ProfileView,
  },
  {
    path: "/edit",
    name: "editProfile",
    component: EditProfileView
},
  {
      path: "/:pathMatch(.*)*",
      name: "notFound",
      component: NotFoundView
  },
  {
      path: "/test",
      name: "test",
      component: EditProfileView
  },
  {
      path: "/test1",
      name: "publish",
      component: PublishView
  },
  {
      path: '/chat',
      component: MessageView,
      name:'chat',
      redirect: '/chat/list',
      children: [
      {
        path: 'list',
        name: 'ChatList',
        component: ChatList
      },
      {
        path: ':id',
        name: 'ChatRoom',
        component: ChatRoom
      },
      {
        path: 'following',
        name: 'Following',
        component: FollowingView
      },
      {
        path: 'received-likes',
        name: 'ReceivedLikes',
        component: ReceivedLikes
      }]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
