import {PermissionState} from "@store/interface";
import {RouteRecordRaw} from 'vue-router'
import {constantRoutes} from '@/router'
import {listRoutes} from "@/api/system/menu";
import { defineStore } from "pinia";
import { store } from "@/store";
const modules = import.meta.glob("../../views/**/**.vue");
export const Layout = () => import( '@/layout/index.vue')

const hasPermission = (roles: string[], route: RouteRecordRaw) => {
    if (route.meta && route.meta.roles) {
        return roles.some(role => {
            if (route.meta?.roles !== undefined) {
                return (route.meta.roles as string[]).includes(role);
            }
        })
    } else {
        return true
    }
}

export const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {
    const res: RouteRecordRaw[] = []
    routes.forEach(route => {
        const tmp = {...route} as any
        if (hasPermission(roles, tmp)) {
            if (tmp.component == 'Layout') {
                tmp.component = Layout
            } else {
                const component = modules[`../../views/${tmp.component}.vue`] as any;
                if (component) {
                    tmp.component = modules[`../../views/${tmp.component}.vue`];
                } else {
                    tmp.component = modules[`../../views/error-page/404.vue`];
                }
            }
            res.push(tmp)

            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
        }
    })
    return res
}


export const usePermissionStore = defineStore({
    id:"permission",
    state:():PermissionState=>( {
        routes: [],
        addRoutes: []
    }),
    actions: {
         setRoutes( routes: RouteRecordRaw[]){
          this.addRoutes = routes
         this.routes = constantRoutes.concat(routes)
        },
         generateRoutes( roles: string[]) {
            return new Promise((resolve, reject) => {
                listRoutes().then(response => {
                    const asyncRoutes = response.data
                    let accessedRoutes
                    if (roles.includes('ROOT')) { // 超级管理员拥有全部权限
                        accessedRoutes = asyncRoutes || []
                    } else {
                        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
                    }
                    this.setRoutes(accessedRoutes)
                    resolve(accessedRoutes)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
})
export function usePermissionStoreHook() {
    return usePermissionStore(store);
}