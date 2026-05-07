// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import BookList from '../views/BookList.vue'
import BookForm from '../views/BookForm.vue'
import BookDetail from '../views/BookDetail.vue'
import Login from '../views/Login.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/', component: BookList, meta: { requerAuth: true } },
  { path: '/novo', component: BookForm, meta: { requerAuth: true } },
  { path: '/editar/:id', component: BookForm, meta: { requerAuth: true } },
  { path: '/livro/:id', component: BookDetail, meta: { requerAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requerAuth && !token) return next('/login')
  if (to.path === '/login' && token) return next('/')
  next()
})

export default router