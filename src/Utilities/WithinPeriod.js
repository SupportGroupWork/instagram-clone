export const withinPeriod = ({date, period}) => date && period && (new Date() - new Date(date * 1000) < period);