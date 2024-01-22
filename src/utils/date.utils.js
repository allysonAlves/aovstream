import moment from 'moment'
import 'moment/dist/locale/pt-br'

export const dateToString = (date) => {
   return moment(date)
   .calendar(null, {
        sameDay: '[Hoje] HH:mm',
        lastDay: '[Ontem] HH:mm',
        sameElse: 'DD/MM/YYYY HH:mm'
    })
}

export const isLessTwoMinutesDiferences = (currentDate, oldDate) => {
    const current = moment(currentDate);   
    const old = moment(oldDate);
    console.log(current.format('HH:mm'))
    return old.add(2,'minutes') > current;
}