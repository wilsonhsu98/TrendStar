export const PAGE_STATUS = {
    FAILED: -1,  // 加载失败
    DONE: 0,   // 加载完毕
    LOADING: 1,   // 正在加载
    COMPLETED: 2    // 已全部加载
};

export const QUERY_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzeX-rbegsYYlvkoGu6tyKKr9FtI5DnbSKjgL-RyHXSnisy2RY/exec?sheetname=${sheetname}&';