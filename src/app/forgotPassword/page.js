"use client"
import React, { useState } from 'react'

import VerifyOtp from './verifyOTP/VerifyOtp'
import ResetPassword from './resetPassword/ResetPassword'
import SendOtp from './sendOTP/SendOtp'
import FullScreenLoading from '@/components/FullScreenLoading'

export default function page() {
  const [step,setStep] = useState(1)
  const [email, setEmail] = useState("");
  const [loading,setLoading] = useState(false);
  return (
    
    <div>
{loading&&<FullScreenLoading/>}
      {
        step == 1 &&
        <SendOtp setStep={setStep} setEmail={setEmail} email={email} setLoading={setLoading}/>
      }
      {
        step == 2 &&
        <VerifyOtp setStep={setStep} setEmail={setEmail} email={email} setLoading={setLoading}/>
      }
      {
        step == 3 &&
        <ResetPassword setStep={setStep} setEmail={setEmail} email={email} setLoading={setLoading}/>
      }
    </div>
  )
}
