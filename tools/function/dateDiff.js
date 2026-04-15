import dayjs from 'utils/dayjs'
function dateDiff(start, end, turul = 'minute') {
    return dayjs(end).diff(dayjs(start), turul)
}

export default dateDiff