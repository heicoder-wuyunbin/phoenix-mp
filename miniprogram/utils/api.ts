const BASE_URL = 'http://localhost:8080';

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

function request<T = any>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token');
    const header: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }

    wx.request({
      url: `${BASE_URL}${url}`,
      method,
      data,
      header,
      success: (res) => {
        // 处理401未授权状态
        if (res.statusCode === 401) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.showToast({
            title: '登录已过期,请重新登录',
            icon: 'none',
          });
          setTimeout(() => {
            wx.redirectTo({ url: '/pages/login/index' });
          }, 1500);
          reject({ code: 401, message: '登录已过期' });
          return;
        }

        const result = res.data as ApiResponse<T>;
        if (result.code === 200) {
          resolve(result);
        } else {
          wx.showToast({
            title: result.message || '请求失败',
            icon: 'none',
          });
          reject(result);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'none',
        });
        reject(err);
      },
    });
  });
}

export const api = {
  login: (data: { loginInfo: string; password: string }) =>
    request<{ token: string; userId: number; username: string; headIco: string; groupId: number; exp: number }>('/api/user/login', 'POST', data),

  register: (data: { username: string; password: string; repassword: string; email?: string; mobile?: string; mobileCode?: string; captchaKey: string; captcha: string }) =>
    request('/api/user/register', 'POST', data),

  sendMobileCode: (mobile: string, captchaKey: string, captcha: string) =>
    request('/api/user/send-mobile-code', 'POST', { mobile, captchaKey, captcha }),

  getCaptcha: (key?: string) => {
    const url = key ? `/api/user/captcha?key=${key}` : '/api/user/captcha';
    return `${BASE_URL}${url}`;
  },

  checkMail: (code: string) =>
    request('/api/user/check-mail', 'GET', { code }),

  logout: () =>
    request('/api/user/logout', 'POST'),

  getCategoryList: () =>
    request<{ id: number; name: string; parentId: number; sortOrder: number }[]>('/api/category/list'),

  getGoodsList: (categoryId: number, pageNum: number, pageSize: number) =>
    request<{
      records: { id: number; name: string; image: string; price: number; categoryName: string; sales: number; stock: number }[];
      total: number;
      size: number;
      current: number;
      pages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }>('/api/goods/list', 'GET', { categoryId, pageNum, pageSize }),
};