function getUnit(originSelect) {
  let dict = {
    'PW':'kWh',
    'AA':'A',
    'BA':'A',
    'CA':'A',
    'AV':'V',
    'BV':'V',
    'CV':'V',
    'ABV':'V',
    'BCV':'V',
    'CAV':'V',
  }
  return dict[originSelect]
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
  getUnit, loadingButton
}
