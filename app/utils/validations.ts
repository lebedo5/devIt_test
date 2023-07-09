

 const emailValidation = (text) => {
	let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
	if (text?.length === 0 && reg.test(text) === false) {
		return false
	} else if (reg.test(text) === true) {
		return true
	}
}

 const passwordValidation = (text) => {
	let reg = /^[A-Za-z]\w{7,14}$/;
	if (text?.length === 0 && reg.test(text) === false) {
		return false
	} else if (reg.test(text) === true) {
		return true
	}
}
