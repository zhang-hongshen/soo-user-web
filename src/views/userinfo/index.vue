<template>
    <div class="app-container">
        <el-tabs class="tabs" v-model="activeTabPaneName" tab-position="left" @tab-click="handleChangeTab">
            <el-tab-pane class="basic-info-tab" :label="tabPaneNames[0]" :name="tabPaneNames[0]">
                <el-button-group class="basic-info-button">
                    <el-button v-if="!basicInfoEditable" type="warning" @click="handleEditBasicInfo">
                        {{$t('common.edit')}}
                    </el-button>
                    <el-button v-if="basicInfoEditable" type="primary" @click="handleSaveBasicInfo">
                        {{$t('common.save')}}
                    </el-button>
                </el-button-group>
                <el-form class="basic-info-form" :model="basicInfoForm" label-width="auto">
                    <el-form-item :label="$t('userInfo.tabPane.basicInfo.username')">
                        <el-input v-model="basicInfoForm.username" :disabled="!basicInfoEditable" />
                    </el-form-item>
                    <el-form-item :label="$t('userInfo.tabPane.basicInfo.phone')">
                        <el-input v-model="basicInfoForm.phone" :disabled="!basicInfoEditable" />
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane class="consignee-info-tab" :label="tabPaneNames[1]" :name="tabPaneNames[1]">
                <div class="consignee-info-button">
                    <el-button type="warning" @click="handleNewConsigneeInfo" icon="el-icon-plus">
                        {{$t('userInfo.tabPane.consigneeInfo.addConsigneeInfo')}}
                    </el-button>
                </div>
                <el-descriptions class="consignee-info-description" title="收货信息" border direction="vertical"
                                 v-for="(consignee, index) in consignees" :key="index">
                    <el-button-group slot="extra">
                        <el-button type="primary" size="small" icon="el-icon-edit" @click="handleEditConsignee(consignee)">
                            {{$t('common.edit')}}
                        </el-button>
                        <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDeleteConsignee(consignee)">
                            {{$t('common.delete')}}
                        </el-button>
                    </el-button-group>
                    <el-descriptions-item label="收货人">{{consignee.consigneeName}}</el-descriptions-item>
                    <el-descriptions-item label="手机号">{{consignee.phone}}</el-descriptions-item>
                    <el-descriptions-item label="收货地址">{{consignee.address}}</el-descriptions-item>
                </el-descriptions>
                <el-dialog center
                           :visible.sync="consigneeDialogVisible"
                           @close="handleNewCosigneeInfoDialogClose"
                           @closed="handleNewCosigneeInfoDialogClosed">
                    <el-form :model="consigneeForm">
                        <el-form-item label="收货人" prop="consigneeName">
                            <el-input v-model="consigneeForm.consigneeName" />
                        </el-form-item>
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="consigneeForm.phone" placeholder="请输入11位有效手机号"/>
                        </el-form-item>
                        <el-form-item label="收货地址" prop="address">
                            <el-input v-model="consigneeForm.address" type="textarea"/>
                        </el-form-item>
                    </el-form>
                    <el-button slot="footer" type="primary" @click="handleSubmitConsignee">
                        {{$t('common.save')}}
                    </el-button>
                </el-dialog>
            </el-tab-pane>
            <el-tab-pane class="change-password-tab" :label="tabPaneNames[2]" :name="tabPaneNames[2]">
                <el-form class="change-password-form"
                         :model="passwordForm"
                         :rules="passwordFormRules"
                         ref="passwordForm"
                         label-width="auto"
                         status-icon>
                    <div v-if="changePasswordStep === 0">
                        <el-form-item :label="$t('userInfo.tabPane.changePassword.oldPassword')" prop="oldPassword">
                            <el-input type="password" v-model="passwordForm.oldPassword" show-password/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleChangePasswordNextStep">
                                {{$t('userInfo.tabPane.changePassword.nextStep')}}</el-button>
                        </el-form-item>
                    </div>
                    <div v-if="changePasswordStep === 1">
                        <el-form-item :label="$t('userInfo.tabPane.changePassword.newPassword')" prop="newPassword">
                            <el-input type="password" v-model="passwordForm.newPassword"></el-input>
                        </el-form-item>
                        <el-form-item :label="$t('userInfo.tabPane.changePassword.confirmPassword')" prop="checkPassword">
                            <el-input type="password" v-model="passwordForm.checkPassword"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleSubmitPassword">确认修改</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import User from "@/api/user";
import {Message} from "element-ui";
import Consignee from "@/api/consignee";
import Validate from "@/utils/validate";

export default {
  data() {
    let validateCheckPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      activeTabPaneIndex: 0,
      activeTabPaneName: '基本信息',
      basicInfoEditable: false,
      basicInfoForm: {
        username: '',
        phone: '',
      },
      consigneeDialogVisible: false,
      consigneeForm: {},
      consignees: [],
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        checkPassword: '',
      },
      passwordFormRules: {
        oldPassword: [
          { validator: Validate.oldPassword, trigger: 'blur' }
        ],
        newPassword: [
          { validator: Validate.newPassword, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validateCheckPassword, trigger: 'blur' }
        ],
      },
      changePasswordStep: 0,
    }
  },
  watch: {
    tabPaneNames() {
      this.activeTabPaneName = this.tabPaneNames[this.activeTabPaneIndex]
    }
  },
  computed: {
    tabPaneNames() {
      return [
        this.$t('userInfo.tabPane.basicInfo.name'),
        this.$t('userInfo.tabPane.consigneeInfo.name'),
        this.$t('userInfo.tabPane.changePassword.name'),
      ]
    }
  },
  async created() {
    this.activeTabPaneName = this.tabPaneNames[this.activeTabPaneIndex]
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      const activeTabPaneIndex = this.activeTabPaneIndex
      if (activeTabPaneIndex === 0) {
        this.basicInfoForm = await User.getBasicInfo()
      } else if (activeTabPaneIndex === 1) {
        this.consignees = await Consignee.list(this.$store.getters.userId)
      } else if (activeTabPaneIndex === 2) {
        this.changePasswordStep = 0
      }
    },
    async handleChangeTab() {
      this.tabPaneNames.forEach((tabPaneName, index) => {
        if (this.activeTabPaneName === tabPaneName) {
          this.activeTabPaneIndex = index
        }
      })
      await this.fetchData()
    },
    handleEditBasicInfo() {
      this.basicInfoEditable = true
    },
    async handleSaveBasicInfo() {
      const res = await User.updateBasicInfo(this.basicInfoForm)
      if (res) {
        Message.success('保存成功！')
      } else {
        Message.error('保存失败！')
      }
      this.basicInfoEditable = false
    },
    handleEditConsignee(consignee) {
      this.consigneeDialogVisible = true
      this.consigneeForm = consignee
    },
    async handleDeleteConsignee(consignee) {
      const res = await Consignee.delete(consignee.id)
      if (res) {
        Message.success('删除成功')
      } else {
        Message.error('删除失败')
      }
      await this.fetchData()
    },
    async handleSubmitConsignee() {
      const res = await Consignee.save(this.$store.getters.userId, this.consigneeForm)
      if (res) {
        Message.success('保存成功')
      } else {
        Message.error('保存失败')
      }
      this.handleNewCosigneeInfoDialogClose()
      await this.fetchData()
    },
    handleNewConsigneeInfo() {
      this.consigneeDialogVisible = true
      this.consigneeForm = {
        id: 0,
        consigneeName:'',
        phone:'',
        address:'',
      }
    },
    handleNewCosigneeInfoDialogClose() {
      this.consigneeDialogVisible = false
    },
    handleNewCosigneeInfoDialogClosed() {
      this.consigneeForm = {}
    },
    handleChangePasswordNextStep() {
       this.$refs.passwordForm.validateField('oldPassword', (valid) => {
         const res = (valid === '')
         if (res) {
           this.changePasswordStep++;
         }
      })
    },
    handleSubmitPassword() {
      this.$refs.passwordForm.validate(async(valid) => {
        if (valid) {
          const res = await User.updatePassword(this.passwordForm.newPassword)
          if (res) {
            Message.success('修改密码成功，请重新登录')
            await this.$router.push('/login')
          } else {
            Message.error('修改密码失败，请重试')
            this.passwordForm = {}
            this.changePasswordStep = 0;
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/mixin";

.app-container {
  padding: 40px;
  @include first-color();

  .tabs {

    /deep/ .el-tabs__item {
      @include first-color();
    }

    /deep/ .el-tabs__item:hover {
      color: #1a73e8 !important;
    }
    .basic-info-tab {
      margin: 10px 20px auto;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      @include second-color();

      .basic-info-button {
        border-radius: 8px;
        margin-bottom: 20px;
      }

      .basic-info-form {
        width: 30%;
        text-align: center;
        display: block;

        /deep/ .el-form-item__label {
          @include first-color();
        }
      }
    }

    .consignee-info-tab {
      margin: 10px 20px auto ;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      @include second-color();

      .consignee-info-button {
        border-radius: 8px;
        margin-bottom: 20px;
      }

      .consignee-info-description {
        width: 50%;
        text-align: center;
        display: block;
      }
    }

    .change-password-tab {
      margin: 10px 20px auto ;

      .change-password-form {
        width: 30%;
        text-align: center;
        display: block;

        /deep/ .el-form-item__label {
          @include first-color();
        }
      }
    }
  }

}
</style>
