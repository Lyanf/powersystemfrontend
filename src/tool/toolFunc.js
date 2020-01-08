function getUnit(originSelect) {
  let dict = {
    'PW':'KWH',
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
export {
  getUnit
}
