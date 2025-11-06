const db = uniCloud.database();
const dbCmd = db.command;
async function beforeRegister({
  userRecord,
  clientInfo
} = {}) {
  let appid = clientInfo.appId;
  let res = await db.collection("uni-id-users").where({
  	dcloud_appid:dbCmd.all([appid])
  }).count();
  if(res.total==0){
	  if(userRecord.role) {
	    userRecord.role.push('manage')
	  } else {
	    userRecord.role = ['manage']
	  }
  }else{
	  if(userRecord.role) {
	    userRecord.role.push('user')
	  } else {
	    userRecord.role = ['user']
	  }
  }
  return userRecord // 务必返回处理后的userRecord
}

module.exports = {
  beforeRegister
}
