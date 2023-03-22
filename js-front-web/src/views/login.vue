<template>
  <div class="login">
    <div class="login-box">
      <img :src="loginBackground" class="login-left">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <div class="title">
          <img :src="logo" style="width:300px;display:block;margin:15px auto;">
        </div>
        <!-- <el-tabs v-model="activeName" stretch @tab-click="handleClick">
          <el-tab-pane label="手机" name="mobile">
            <el-form-item prop="username">
              <div style="display: flex; justify-content: space-between;">
                <el-input
                  v-model="loginForm.username"
                  type="text"
                  auto-complete="off"
                  placeholder="手机号"
                >
                  <svg-icon
                    slot="prefix"
                    icon-class="user"
                    class="el-input__icon input-icon"
                  />
                </el-input>
                <el-button style="margin-left: 20px" type="primary">获取验证码</el-button>
              </div>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                auto-complete="off"
                placeholder="验证码"
                @keyup.enter.native="handleLogin"
              >
                <svg-icon
                  slot="prefix"
                  icon-class="password"
                  class="el-input__icon input-icon"
                />
              </el-input>
            </el-form-item>
          </el-tab-pane> -->
        <!-- <el-tab-pane label="邮箱" name="email"> -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            auto-complete="off"
            placeholder="账号"
          >
            <svg-icon
              slot="prefix"
              icon-class="user"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon
              slot="prefix"
              icon-class="password"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-form-item v-if="captchaEnabled" prop="code">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon
              slot="prefix"
              icon-class="validCode"
              class="el-input__icon input-icon"
            />
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" class="login-code-img" @click="getCode">
          </div>
        </el-form-item>
        <el-form-item
          style="display: flex;
          justify-content: end;"
        >
          <el-link style="color: #409eff; " @click="forgetPassword">忘记密码？</el-link>
        </el-form-item>
        <!-- </el-tab-pane> -->
        <!-- </el-tabs> -->
        <!--
        <el-checkbox
          v-model="loginForm.rememberMe"
          style="margin: 0px 0px 25px 0px"
          >记住密码</el-checkbox
        >
        -->
        <el-form-item style="width: 100%; margin-top: 20px;">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width: 100%"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          <div v-if="register" style="float: right">
            <router-link
              class="link-type"
              :to="'/register'"
            >立即注册</router-link>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>SPRUCE MEDIMAGING TECHNOLOGY CO.,LTD.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from '@/api/login'
import logo from '@/assets/logo/logo.png'
import loginBackground from '@/assets/images/login-background.jpg'
import Cookies from 'js-cookie'
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: 'Login',
  data() {
    return {
      logo,
      loginBackground,
      codeUrl: '',
      loginForm: {
        username: '',
        password: '',
        rememberMe: false,
        code: '',
        uuid: ''
      },
      activeName: 'email',
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '请输入您的账号' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请输入您的密码' }
        ],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCode()
    // this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then((res) => {
        this.captchaEnabled =
          res.captchaEnabled === undefined ? true : res.captchaEnabled
        if (this.captchaEnabled) {
          this.codeUrl = 'data:image/gif;base64,' + res.img
          this.loginForm.uuid = res.uuid
        }
      })
    },
    getCookie() {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set('username', this.loginForm.username, { expires: 30 })
            Cookies.set('password', encrypt(this.loginForm.password), {
              expires: 30
            })
            Cookies.set('rememberMe', this.loginForm.rememberMe, {
              expires: 30
            })
          } else {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
          }
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              // 清除项目，进入后重新选择
              localStorage.removeItem('chooseProject')
              sessionStorage.removeItem('assessListParams')
              this.$store.dispatch('GetInfo').then((res) => {
                this.$store.commit('SET_ROLES', [])
                const filterRoles = res.user.roles.filter((item) => ['CRC', 'CRA', 'PI'].includes(item.roleKey))
                if (filterRoles.length > 0) {
                  this.$router.push({ path: '/image/examinee' })
                  return
                }
                this.$router.push({ path: this.redirect || '/' })
              })
            })
            .catch(() => {
              this.loading = false
              if (this.captchaEnabled) {
                this.getCode()
              }
            })
        }
      })
    },
    forgetPassword() {
      this.$message.error('如果您忘记了密码请与管理员联系重置密码，谢谢！')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.png");
  background-size: cover;
}
.login-box {
    width: 1080px;
    background: white;
}
.login-left {
    width: 678px;
    float: left;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #323e52;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title-words {
    overflow: hidden;
    margin-left: 15px;
    .cn-title {
      font-size: 36px;
      font-weight: bolder;
      float: left;
      letter-spacing: 7px;
    }
    .en-title {
      float: left;
      font-size: 14px;
    }
  }
}

.login-form {
  float: right;
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
