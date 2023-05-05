export function getMonthName(monthNum) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  return months[monthNum - 1];
}

export function getMonthsBetweenDates(startDate, endDate) {
  let months = [];
  const currentDate = new Date(startDate);
  const endD = new Date(endDate);  
  let endate = endD.getDate();

  while (endD >= currentDate) {
    var month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    var year = currentDate.getFullYear();
    var date = currentDate.getDate();

    months.push(date + '-' + month + '-' + year);
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  let newMs = months
  const newARR = []
  newMs.forEach((month, i)=> {
    if(i===0){
      newARR.push(month);
    }else{
      newARR.push(endate+'-'+month.split('-')[1]+'-'+month.split('-')[2])
    }
    // `${i===0?month:enddate+'-'+month.split('-')[1]+'-'+month.split('-')[2]}`
  })
  // console.log(months)

  return newARR;
}
