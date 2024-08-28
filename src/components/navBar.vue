<!-- <template>
  <VueNavigationBar :options="navbarOptions" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import VueNavigationBar from 'vue-navigation-bar';
import { ElAvatar, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import { useUserStore } from '@/stores/userStore'; 

const router = useRouter();
const userStore = useUserStore();

const handleLogout = () => {
  userStore.clearUser(); // 清空 userStore
  router.push({ name: 'home' }); // 跳转到首页
};

const navbarOptions = ref({
  elementId: "main-navbar",
  isUsingVueRouter: true,
  mobileBreakpoint: 992,

  collapseButtonOpenColor: "#661c23",
  collapseButtonCloseColor: "#661c23",
  showBrandImageInMobilePopup: true,
  ariaLabelMainNav: "Main Navigation",
  tooltipAnimationType: "shift-away",
  tooltipPlacement: "bottom",
  menuOptionsLeft: [
    { type: 'link', text: '首页', path: { name: 'home' }, iconLeft: '<img src="src/assets/main.png" alt="首页" class="nav-icon">' },
    { type: 'link', text: '论坛', path: { name: 'section' }, iconLeft: '<img src="src/assets/sections.png" alt="论坛" class="nav-icon">' },
    { type: 'link', text: '发布', path: { name: 'publish' }, iconLeft: '<img src="src/assets/publish.png" alt="发布" class="nav-icon">' }
  ],
  menuOptionsRight: [
    {
      type: 'component',
      component: {
        template: `
          <el-dropdown>
            <span class="el-dropdown-link">
              <el-avatar src="@/assets/user-avatar.png" size="default"></el-avatar>
              <span>用户名</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <img src="@/assets/user.png" alt="用户中心" class="nav-icon"> 用户中心
              </el-dropdown-item>
              <el-dropdown-item>
                <img src="@/assets/edit.png" alt="账户设置" class="nav-icon"> 账户设置
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        `
      }
    },
    { type: 'link', text: '', path: { name: 'ChatList' }, iconLeft: '<img src="src/assets/private.png" alt="私信" class="nav-icon">' },
    {
      type: 'component',
      component: {
        template: `
          <button @click="handleLogout">
            <img src="@/assets/logout.png" alt="登出" class="nav-icon">
          </button>
        `,
        methods: {
          handleLogout
        }
      }
    }
  ]
});
</script>

<style scoped>
.vnb {
  background: #ff784b; /* Sunset Orange */
  --vnb-background-color: #fff2e8; /* A lighter shade for contrast */
  width: 100%;
  height: 60px; /* 设置适当的高度 */
  margin-top: 0%;
}

.vnb__link {
  color: #fa541c;
}

.vnb__link:hover {
  color: #d4380d;
}

.nav-icon {
  width: 20px; /* 设置图片宽度 */
  height: 20px; /* 设置图片高度 */
}
</style> -->