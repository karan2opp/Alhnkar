export const SIZES = {
  clothing: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  bottom:   ["28", "30", "32", "34", "36", "38", "40"],
  freesize: ["Free Size"]
}

export const ALL_SIZES = [
  ...SIZES.clothing,
  ...SIZES.bottom,
  ...SIZES.freesize,
];