import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/pages/home/Home'
import Forum from '@/components/pages/forum/Forum'
import Thread from '@/components/pages/thread/Thread'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
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
    }
  ]
})
