/**
 * 格式化日期
 * @param t 时间戳
 * @returns 格式化后的日期字符串
 */
export function formatDate(t: number | undefined): string {
    t = t || Date.now();
    const time = new Date(t);
    const now = new Date();
    
    const isToday = time.toDateString() === now.toDateString();
    
    const month = time.getMonth() + 1;
    const date = time.getDate();
    const hours = time.getHours();
    const minutes = time.getMinutes();

    const formatNumber = (n: number): string => n < 10 ? `0${n}` : `${n}`;

    if (isToday) {
        return `${formatNumber(hours)}:${formatNumber(minutes)}`;
    } else {
        return `${formatNumber(month)}-${formatNumber(date)} ${formatNumber(hours)}:${formatNumber(minutes)}`;
    }
}

/**
 * 距当前时间点的时长
 * @param time 13位时间戳
 * @returns 格式化后的时间差字符串
 */
export function formateTime(time: number): string {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const now = new Date().getTime();
    const diffValue = now - time;

    // 计算差异时间的量级
    const dayC = diffValue / day;
    const hourC = diffValue / hour;
    const minC = diffValue / minute;
    const secondC = diffValue / second;

    if (dayC >= 1) {
        return `${Math.floor(dayC)}天`;
    } else if (hourC >= 1) {
        return `${Math.floor(hourC)}小时`;
    } else if (minC >= 1) {
        return `${Math.floor(minC)}分钟`;
    } else if (secondC >= 1) {
        return `刚刚`;
    } else {
        return '0秒';
    }
}