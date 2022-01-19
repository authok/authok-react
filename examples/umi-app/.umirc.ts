import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  fastRefresh: {},
  define: {
    'process.env.UMI_PUBLIC_DOMAIN': 'wsz.cn.authok.cn',
    'process.env.UMI_PUBLIC_CLIENT_ID': 'B2b8F5A5yGqkAgSM8i2yotsGeSnurxDJ',
    'process.env.UMI_PUBLIC_AUDIENCE': 'https://api.example.com/users',
    'process.env.UMI_PUBLIC_API_PORT': 3001,
  }
});
