import moment from 'moment'
import 'moment/dist/locale/pt-br'

export const dateToString = (date) => {
    const dateTime = moment(date);
    return ` ${dateTime.calendar(null, 
    {
        sameDay: `[Hoje]`,
        lastDay: '[Ontem]',
        sameElse: 'DD/MM/YYYY'
    })} às ${dateTime.format('HH:mm')}`;
}

export const isLessTwoMinutesDiferences = (currentDate, oldDate) => {
    const current = moment(currentDate);   
    const old = moment(oldDate);
    console.log(current.format('HH:mm'))
    return old.add(2,'minutes') > current;
}