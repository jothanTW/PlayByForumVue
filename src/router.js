import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/home/Home'
import Forum from '@/components/pages/forum/Forum'
import Thread from '@/components/pages/thread/Thread'
import CreateThread from '@/components/pages/CreateThread'
import UserProfile from "@/components/pages/user/UserProfile"
import CharacterSheet from "@/components/pages/user/CharacterSheet"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/forum/:forum/create-thread',
      name: 'createThread',
      component: CreateThread
    },
    {
      path: '/forum/:forum/:page?',
      name: 'forum',
      component: Forum
    },
    {
      path: '/thread/:thread/:page?',
      name: 'thread',
      component: Thread
    },
    {
      path: '/user/:user?',
      name: "user",
      component: UserProfile
    },
    {
      path: '/user/:userid/character/:characterid',
      name: "character",
      component: CharacterSheet
    }
  ]
})
