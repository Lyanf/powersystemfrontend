import moment from "moment";
function getUnit(originSelect) {
  let dict = {'FKA': 'kWh', 'BKA': 'kWh', 'FKR': 'kVarh', 'BKR': 'kVarh', 'FFR': '吨', 'BFR': '吨', 'FRH': '立方米', 'GAS': '立方米', 'Water': '吨', 'FRL': '立方米', 'FKA1': 'kWh', 'FKA2': 'kWh', 'FKA3': 'kWh', 'PW': 'kWh', 'AA': 'A', 'BA': 'A', 'CA': 'A', 'AV': 'V', 'BV': 'V', 'CV': 'V', 'ABV': 'V', 'BCV': 'V', 'CAV': 'V', 'IFR': '立方米', 'IFRA': 'A', 'FBFR': '立方米'}

  return dict[originSelect]
}
function getMeasurePointChineseName(measurePointEnglishName) {
  let dict =  {'FKA': '正向有功电度', 'BKA': '反向有功电度', 'FKR': '正向无功电度', 'BKR': '反向无功电度', 'FFR': '正向累积流量', 'BFR': '反向累积流量', 'FRH': '流量计累积流量高位', 'GAS': '用汽量', 'Water': '用水量', 'FRL': '流量计累积流量低位', 'FKA1': '正向有功电度1', 'FKA2': '正向有功电度2', 'FKA3': '正向有功电度3', 'PW': '用电量', 'AA': 'A相电流', 'BA': 'B相电流', 'CA': 'C相电流', 'AV': 'A相电压', 'BV': 'B相电压', 'CV': 'C相电压', 'ABV': 'AB线电压', 'BCV': 'BC线电压', 'CAV': 'CA线电压', 'IFR': '瞬时流量', 'IFRA': '瞬时流量对应电流值', 'FBFR': '正反向累积流量'}
  return dict[measurePointEnglishName]
}
function getMeasurePointAndUnit(measurePoint,hasValue){
  let unit = getUnit(measurePoint)
  if (hasValue === 0){
    return measurePoint+'('+unit+')'
  }
  else{
    return measurePoint+'值'+'('+unit+')'
  }
}
function changeDateFormat(originalDate){
  if (originalDate instanceof Array){
    let start = moment(originalDate[0]).format('YYYY-MM-DD HH:mm:ss');
    let end = moment(originalDate[1]).format('YYYY-MM-DD HH:mm:ss');
    return [start,end]
  }
  else{
    return moment(originalDate).format('YYYY-MM-DD HH:mm:ss');
  }

}

function loadingButton (loading,that) {
  if (loading === true)
  {
    // that.buttonText = '计算中'
    that.loading = true
  }
  else{
    // that.buttonText = '计算'
    that.loading = false
  }
}
export {
  getUnit, loadingButton, changeDateFormat, getMeasurePointAndUnit
}
