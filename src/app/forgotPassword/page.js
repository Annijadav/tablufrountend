"use client"
import React, { useState } from 'react'

import VerifyOtp from './verifyOTP/VerifyOtp'
import ResetPassword from './resetPassword/ResetPassword'
import SendOtp from './sendOTP/SendOtp'

export default function page() {
  const [step,setStep] = useState(1)
  const [email, setEmail] = useState("");
  return (
    <div>

      {
        step == 1 &&
        <SendOtp setStep={setStep} setEmail={setEmail} email={email}/>
      }
      {
        step == 2 &&
        <VerifyOtp setStep={setStep} setEmail={setEmail} email={email}/>
      }
      {
        step == 3 &&
        <ResetPassword setStep={setStep} setEmail={setEmail} email={email}/>
      }
    </div>
  )
}
