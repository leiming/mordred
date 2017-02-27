/**
 * 函数结果返回值？
 * @param data
 * @param msg
 * @param status
 * @return {*}
 */
export const getResult = (data = "", msg = "OK", status = 200) => {
  const result = {
    status,
    msg,
  }
  return data ? { ...result, data: data } : result
}
