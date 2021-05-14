export const API_DOMAIN = 'http://api.rmsattamataka.com';

export enum apiUrls {
  getClients = '/api/user/getclients',
  getBalance = '/api/user/GetBalance',
  getUserDetail = '/api/account/getuserdetails',

  depositAmount = '/api/user/depositAmount',
  withdrawAmount = '/api/user/withdrawAmount',
  changeExposureLimit = '/api/user/changeExposureLimit',
  changeCreditAmount = '/api/user/changeCreditAmount',
  ChangeStatus = '/api/user/ChangeStatus',
  changePassword = '/api/user/changePassword',

  token = '/token',
  addnewuser = '/api/account/addnewuser',

  getMatkaBusinessList = '/api/business/GetMatkaBusinessList',
  addMatkaResult = '/api/business/AddMatkaResult',
  getMatkaResults = '/api/business/GetMatkaResults',
  getmatkagames = '/api/matkagames/getmatkagames',
  placebid = '/api/matkagames/placebid',

  getAccountStatement = '/api/reports/GetAccountStatement',
  getProfitLoss = '/api/reports/GetProfitLoss',
  getBettings = '/api/reports/GetBettings',
  getCurrentBets = '/api/reports/GetCurrentBets',
  getBetDetails = '/api/reports/GetBetDetails',

  getMarketAnalysis = '/api/business/GetMarketAnalysis',
}
