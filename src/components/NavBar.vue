<template>
    <div class="navbar-container">
        <el-menu class="navbar" mode="horizontal">

            <span class="left-navbar">
                <el-menu-item index="1" @click="handleJumpToHome">{{$t('navbar.home')}}</el-menu-item>
            </span>

            <span class="right-navbar">
                <el-submenu index="2" :popper-append-to-body="false">
                    <div slot="title">
                        <span class="iconfont icon-dark-theme"/>
                        {{themeName}}
                    </div>
                    <el-menu-item v-for="themeName in themeNames" :key="themeName" @click="handleSwitchTheme(themeName)">
                        {{themeName}}</el-menu-item>
                </el-submenu>
                <el-submenu index="3" :popper-append-to-body="false">
                    <div slot="title">
                        <span class="iconfont icon-language"/>
                        {{lang}}
                    </div>
                    <el-menu-item v-for="lang of langs" :key="lang[0]" @click="handleSwitchLang(lang)">
                        {{lang[1]}}</el-menu-item>
                </el-submenu>
                <el-menu-item index="4" @click="handleJumpToShoppingCart">
                    <span class="iconfont icon-cart"/>
                    {{$t('navbar.cart')}}
                </el-menu-item>
                <el-submenu index="5" v-if="$store.getters.userId" :popper-append-to-body="false">
                    <el-avatar slot="title" :src="$store.getters.avatar"/>
                    <el-menu-item index="5-1" @click="handleJumpToOrder">
                        <span class="iconfont icon-order"/>
                        {{$t('navbar.order')}}
                    </el-menu-item>
                    <el-menu-item index="5-2" @click="handleJumpToUserInfo">
                        <span class="iconfont icon-information"/>
                        {{$t('navbar.userInfo')}}
                    </el-menu-item>
                    <el-menu-item index="5-3" @click="handleLogout">
                        <span class="iconfont icon-logout"/>
                        {{$t('navbar.logout')}}
                    </el-menu-item>
                </el-submenu>
                <div  v-else style="display: inline-flex; flex-direction: row">
                    <el-menu-item index="6">
                        <el-button class="login-button" @click="handleLoginDialogOpen">{{$t('navbar.login')}}</el-button>
                    </el-menu-item>
                    <el-menu-item index="7">
                        <el-button class="register-button" @click="handleRegisterDialogOpen">{{$t('navbar.signUp')}}</el-button>
                    </el-menu-item>
                </div>
            </span>
        </el-menu>

        <el-dialog custom-class="login-dialog" center width="400px"
                   :modal-append-to-body="false"
                   :visible="$store.getters.loginDialogVisible"
                   @open="handleLoginDialogOpen"
                   @close="handleLoginDialogClose"
                   @closed="handleLoginDialogClosed">
            <el-form ref="loginForm" :model="loginForm" class="login-form" autocomplete="ont" label-position="left">
                <el-form-item prop="username">
                    <el-input
                        v-model="loginForm.username"
                        placeholder="请输入用户名"
                        prefix-icon="el-icon-user"
                        name="username"
                        type="text"
                    />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        v-model="loginForm.password"
                        show-password
                        placeholder="请输入密码"
                        name="password"
                        @keyup.enter.native="handleLogin"
                    />
                </el-form-item>
            </el-form>
            <el-button slot="footer" class="login-button" @click="handleLogin">{{$t('navbar.login')}}</el-button>
        </el-dialog>

        <el-dialog custom-class="register-dialog" center width="400px"
                   :modal-append-to-body="false"
                   :visible="$store.getters.registerDialogVisible"
                   @open="handleRegisterDialogOpen"
                   @close="handleRegisterDialogClose"
                   @closed="handleRegisterDialogClosed">
            <el-form  class="register-form" :model="registerForm" :rules="rules"
                      ref="registerForm"
                      label-position="right" label-width="auto">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="registerForm.username" placeholder="请输入用户名"/>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="registerForm.phone" placeholder="请输入11位手机号"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        v-model="registerForm.password"
                        type="password"
                        placeholder="请输入密码"
                        show-password/>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPassword">
                    <el-input
                        v-model="checkPassword"
                        type="password"
                        placeholder="请再一次输入密码"
                        show-password/>
                </el-form-item>
            </el-form>
            <el-button slot="footer" class="register-button" @click="handleRegister">{{$t('navbar.createAccount')}}</el-button>
        </el-dialog>

    </div>
</template>

<script>

import {Message} from "element-ui";
import Validate from "@/utils/validate";
import '../assets/iconfont/iconfont.css';

export default {
  inject: ['reload'],
  data() {
    let validateCheckPassword = (rule, value, callback) => {
      if (this.checkPassword === '') {
        callback(new Error('请再次输入密码'));
      } else if (this.checkPassword !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      themeIndex: 0,
      themeModes: ['light', 'dark'],
      themeName: '浅色主题',
      lang: '简体中文',
      langs: [
        ['zhCN' , '简体中文'],
        ['en' , 'English'],
      ],
      loginForm: {
        username: '123456',
        password: '123456'
      },
      passwordVisible: false,
      checkPassword:'',
      registerForm:{
        username:'',
        phone:'',
        password:'',
      },
      rules: {
        username: [
          { validator: Validate.username, trigger: 'blur' }
        ],
        phone: [
          { validator: Validate.phone, trigger: 'blur'}
        ],
        password: [
          { validator: Validate.newPassword, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validateCheckPassword, trigger: 'blur' }
        ],
      },
    }
  },
  computed: {
    themeNames() {
      return [
        this.$t('navbar.themes.light'),
        this.$t('navbar.themes.dark'),
      ]
    }
  },
  watch: {
    themeNames() {
      this.themeName = this.themeNames[this.themeIndex]
    }
  },
  created() {
    for (const lang of this.langs) {
      if (lang[0] === this.$i18n.locale) {
        this.lang = lang[1]
      }
    }
    if (!localStorage.theme) {
      localStorage.theme = 'light'
    }
    window.document.documentElement.setAttribute('theme', localStorage.theme)
    this.themeModes.forEach((themeMode, index) => {
      if (themeMode === localStorage.theme) {
        this.themeIndex = index
      }
    })
    this.themeName = this.themeNames[this.themeIndex]
  },
  methods: {
    handleSwitchLang(lang) {
      this.lang = lang[1]
      localStorage.lang = lang[0]
      this.$i18n.locale = localStorage.lang
    },
    handleSwitchTheme(themeName) {
      this.themeName = themeName
      this.themeNames.forEach( (themeName, index) => {
        if (themeName === this.themeName) {
          this.themeIndex = index
        }
      })
      localStorage.theme = this.themeModes[this.themeIndex]
      window.document.documentElement.setAttribute('theme', localStorage.theme)
    },
    handleJumpToShoppingCart() {
      this.$router.push('/cart')
    },
    handleJumpToHome() {
      this.$router.push('/')
    },
    handleLoginDialogOpen() {
      this.loginForm = {
        username: '123456',
        password: '123456'
      }
      this.$store.dispatch('navbar/showLoginDialog')
    },
    handleLogin() {
      this.$store.dispatch('user/login', this.loginForm).then((res) => {
        if (res) {
          this.$store.dispatch('user/getUserInfo').then(() => {
            this.handleLoginDialogClose()
            this.reload()
          })
        } else {
          Message.error('用户名或密码错误')
        }
      })
    },
    handleLoginDialogClose() {
      this.$store.dispatch('navbar/hideLoginDialog')
    },
    handleLoginDialogClosed() {
      this.loginForm = {
        username: '123456',
        password: '123456'
      }
    },
    handleRegisterDialogOpen() {
      this.registerForm = {
        username:'',
        phone:'',
        password:'',
      }
      this.checkPassword = ''
      this.$store.dispatch('navbar/showRegisterDialog')
    },
    handleRegister() {
      this.$refs.registerForm.validate(async (valid) => {
        if (valid) {
          this.$store.dispatch('user/register', this.registerForm).then( (res) => {
            if (res) {
              this.handleRegisterDialogClose()
              this.loginForm = {
                username: this.registerForm.username,
                password: this.registerForm.password
              }
              this.handleLogin()
            } else {
              Message.error('注册失败！')
            }
          })
        }
      })
    },
    handleRegisterDialogClose() {
      this.$store.dispatch('navbar/hideRegisterDialog')
    },
    handleRegisterDialogClosed() {
      this.registerForm = {}
    },
    handleLogout() {
      this.$store.dispatch('user/logout').then((res) => {
        if (res) {
          this.$router.push('/')
        }
      })
    },
    handleJumpToOrder() {
      this.$router.push('/order')
    },
    handleJumpToUserInfo() {
      this.$router.push('/userinfo')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/navbar';

</style>
