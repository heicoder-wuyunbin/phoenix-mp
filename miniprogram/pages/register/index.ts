import { api } from '../../utils/api';

function generateRandomKey(): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

Page({
  data: {
    username: '',
    password: '',
    repassword: '',
    account: '',
    mobileCode: '',
    captcha: '',
    captchaKey: '',
    captchaUrl: '',
    regType: 'email' as 'email' | 'mobile',
    loading: false,
    codeLoading: false,
    countdown: 0,
    showEmailSuccess: false,
    sendingMail: false,
  },

  onLoad() {
    this.refreshCaptcha();
  },

  onUsernameInput(e: any) {
    this.setData({ username: e.detail });
  },

  onPasswordInput(e: any) {
    this.setData({ password: e.detail });
  },

  onRepasswordInput(e: any) {
    this.setData({ repassword: e.detail });
  },

  onAccountInput(e: any) {
    this.setData({ account: e.detail });
  },

  onMobileCodeInput(e: any) {
    this.setData({ mobileCode: e.detail });
  },

  onCaptchaInput(e: any) {
    this.setData({ captcha: e.detail });
  },

  refreshCaptcha() {
    const key = generateRandomKey();
    const url = api.getCaptcha(key);
    this.setData({ captchaKey: key, captchaUrl: url, captcha: '' });
  },

  switchToEmail() {
    this.setData({ regType: 'email', mobileCode: '' });
  },

  switchToMobile() {
    this.setData({ regType: 'mobile' });
  },

  async onGetMobileCode() {
    const { account, captchaKey, captcha } = this.data;
    if (!account.trim()) {
      wx.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(account)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }
    if (!captcha.trim()) {
      wx.showToast({ title: '请输入图形验证码', icon: 'none' });
      return;
    }

    this.setData({ codeLoading: true });
    try {
      await api.sendMobileCode(account, captchaKey, captcha);
      wx.showToast({ title: '验证码已发送', icon: 'success' });
      this.startCountdown();
      this.refreshCaptcha();
    } catch (err) {
      console.error('发送验证码失败:', err);
      this.refreshCaptcha();
    } finally {
      this.setData({ codeLoading: false });
    }
  },

  startCountdown() {
    this.setData({ countdown: 60 });
    const timer = setInterval(() => {
      const { countdown } = this.data;
      if (countdown <= 1) {
        clearInterval(timer);
        this.setData({ countdown: 0 });
      } else {
        this.setData({ countdown: countdown - 1 });
      }
    }, 1000);
  },

  async onRegister() {
    const { username, password, repassword, account, mobileCode, captchaKey, captcha, regType } = this.data;

    if (!username.trim()) {
      wx.showToast({ title: '请输入用户名', icon: 'none' });
      return;
    }
    if (!password.trim()) {
      wx.showToast({ title: '请输入密码', icon: 'none' });
      return;
    }
    if (password !== repassword) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' });
      return;
    }
    if (!account.trim()) {
      wx.showToast({ title: regType === 'email' ? '请输入邮箱' : '请输入手机号', icon: 'none' });
      return;
    }
    if (regType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account)) {
      wx.showToast({ title: '请输入正确的邮箱', icon: 'none' });
      return;
    }
    if (regType === 'mobile' && (!/^1[3-9]\d{9}$/.test(account) || !mobileCode.trim())) {
      wx.showToast({ title: '请输入正确的手机号和验证码', icon: 'none' });
      return;
    }
    if (!captcha.trim()) {
      wx.showToast({ title: '请输入图形验证码', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    try {
      await api.register({
        regType,
        username,
        password,
        repassword,
        email: regType === 'email' ? account : undefined,
        mobile: regType === 'mobile' ? account : undefined,
        mobileCode: regType === 'mobile' ? mobileCode : undefined,
        captchaKey,
        captcha,
      });

      if (regType === 'email') {
        this.setData({ showEmailSuccess: true });
      } else {
        wx.showToast({ title: '注册成功', icon: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      }
    } catch (err) {
      console.error('注册失败:', err);
      this.refreshCaptcha();
    } finally {
      this.setData({ loading: false });
    }
  },

  async onResendMail() {
    const { account } = this.data;
    this.setData({ sendingMail: true });
    try {
      await api.sendCheckMail(account);
      wx.showToast({ title: '验证邮件已重新发送', icon: 'success' });
    } catch (err) {
      console.error('重发邮件失败:', err);
    } finally {
      this.setData({ sendingMail: false });
    }
  },

  onGoToLogin() {
    wx.navigateBack();
  },
});
