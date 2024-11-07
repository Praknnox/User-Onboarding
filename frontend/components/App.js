// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React,{useState,useEffect} from 'react'
import axios from 'axios'
import * as yup from 'yup'


const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}
const userSchema=yup.object().shape({
  username:yup.string().trim().required(e.usernameRequired)
  .min(3,e.usernameMin).max(20,e.usernameMax),
  favLanguage:yup.string().required(e.favFoodRequired).trim()
  .oneOf(['javascript','rust'],e.favLanguageOptions),
  favFood:yup.string().required(e.favFoodRequired).trim()
  .oneOf(['broccoli','spaghetti','pizza'],e.favFoodOptions),
  agreement:yup.boolean().required(e.agreementRequired)
  .oneOf([true],e.agreementOptions)
})

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.
const getInit=()=>({
  username:'',
  favLanguage:'',
  favFood:'',
  agreement:false
})
const getInitErr=()=>({
  username:'',
  favLanguage:'',
  favFood:'',
  agreement:''
})


export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.
  const [valu,setValer]=useState(getInit())
  const [erroar,setErrr]=useState(getInitErr())
  const [isSuccess,setSuccess]=useState()
  const [isFail,setFail]=useState()
  const [nableSub,setSubF]=useState(false)
  useEffect(()=>{
    userSchema.isValid(valu).then(setSubF)
  },[valu])


  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.

  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    let {type,name,value,checked}=evt.target
    value=type=='checkbox'?checked:value
    setValer({...valu,[name]:value})
    yup.reach(userSchema,name).validate(value).then(()=>
    setErrr({...erroar,[name]:''})).catch((err)=>
    setErrr({...erroar,[name]:err.errors[0]}))
  }

  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault()
    axios.post('https://webapis.bloomtechdev.com/registration',valu).then(res=>{
      setValer(getInit())
      setSuccess(res.data.message)
      setFail()
    }).catch(err=>{
      setFail(err.response.data.message)
      setSuccess()
    })
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        {isSuccess&&<h4 className="success">{isSuccess}</h4>}
        {isFail&&<h4 className="error">{isFail}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input id="username" name="username" type="text" placeholder="Type Username" value={valu.username} onChange={onChange}/>
          {erroar.username&&<div className="validation">{erroar.username}</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input type="radio" name="favLanguage" value="javascript" onChange={onChange} checked={valu.favLanguage=='javascript'}/>
              JavaScript
            </label>
            <label>
              <input type="radio" name="favLanguage" value="rust" onChange={onChange} checked={valu.favLanguage=='rust'}/>
              Rust
            </label>
          </fieldset>
          {erroar.favLanguage&&<div className="validation">{erroar.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" value={valu.favFood} onChange={onChange}>
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {erroar.favFood&&<div className="validation">{erroar.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input id="agreement" type="checkbox" name="agreement" onChange={onChange} checked={valu.agreement}/>
            Agree to our terms
          </label>
          {erroar.agreement&&<div className="validation">{erroar.agreement}</div>}
        </div>

        <div>
          <input type="submit" disabled={!nableSub} />
        </div>
      </form>
    </div>
  )
}
