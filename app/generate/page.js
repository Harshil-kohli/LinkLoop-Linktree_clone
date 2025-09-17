"use client"
import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useSearchParams } from 'next/navigation'

const Generate = () => {
  const searchParams = useSearchParams()
  const [links, setLinks] = useState([{ link: "", linktext: "" }])
  const [handle, sethandle] = useState("")
  const [pic, setpic] = useState("")
  const [desc, setdesc] = useState("")

  useEffect(() => {
    const h = searchParams.get("handle")
    if (h) sethandle(h)
  }, [searchParams])

  const handleChange = (index, link, linktext) => {
    setLinks(initialLinks =>
      initialLinks.map((item, i) => i === index ? { link, linktext } : item)
    )
  }

  const addLink = () => {
    setLinks(links.concat([{ link: "", linktext: "" }]))
  }

  const submitLinks = async () => {
    const filteredLinks = links.filter(e => e.linktext !== "" && e.link !== "")
    setLinks(filteredLinks)

    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")

    const raw = JSON.stringify({
      links: filteredLinks,
      handle: handle,
      pic: pic,
      desc: desc
    })

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    }

    try {
      const r = await fetch("/api/add", requestOptions) 
      const result = await r.json()
      if (result.success) {
        toast.success(result.message)
        setLinks([])
        setpic("")
        sethandle("")
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      toast.error("Something went wrong.")
    }
  }

  return (
    <div className='bg-[#E9C0E9] min-h-screen grid grid-cols-2'>
      <div className="col1 flex justify-center items-center flex-col mt-20 text-gray-900">
        <div className='flex flex-col gap-5 my-8'>
          <h1 className='font-bold text-4xl'>Create your Bittree</h1>
          <div className="item">
            <h2 className='font-semibold text-2xl'>Step 1: Claim your Handle</h2>
            <div className='mx-4'>
              <input
                value={handle || ""}
                onChange={e => sethandle(e.target.value)}
                className='px-4 py-2 my-2 outline outline-pink-500 rounded-full'
                type="text"
                placeholder='Choose a Handle'
              />
            </div>
          </div>

          <div className="item">
            <h2 className='font-semibold text-2xl'>Step 2: Add Links</h2>
            {links.map((item, index) => (
              <div key={index} className='mx-4'>
                <input
                  value={item.linktext || ""}
                  onChange={e => handleChange(index, item.link, e.target.value)}
                  className='px-4 py-2 mx-2 my-2 outline outline-pink-500 rounded-full'
                  type="text"
                  placeholder='Enter link text'
                />
                <input
                  value={item.link || ""}
                  onChange={e => handleChange(index, e.target.value, item.linktext)}
                  className='px-4 py-2 mx-2 my-2 outline outline-pink-500 rounded-full'
                  type="text"
                  placeholder='Enter link'
                />
              </div>
            ))}
            <button
              onClick={addLink}
              className='p-5 py-2 mx-2 bg-slate-900 text-white font-bold rounded-3xl'
            >
              + Add Link
            </button>
          </div>

          <div className="item">
            <h2 className='font-semibold text-2xl'>Step 3: Add Picture and Description</h2>
            <div className='mx-4 flex flex-col'>
              <input
                value={pic || ""}
                onChange={e => setpic(e.target.value)}
                className='px-4 py-2 mx-2 my-2 outline outline-pink-500 rounded-full'
                type="text"
                placeholder='Enter link to your Picture'
              />
              <input
                value={desc || ""}
                onChange={e => setdesc(e.target.value)}
                className='px-4 py-2 mx-2 my-2 outline outline-pink-500 rounded-full'
                type="text"
                placeholder='Enter description'
              />
              <button
                disabled={pic === "" || handle === "" || links[0].linktext === ""}
                onClick={submitLinks}
                className='disabled:bg-slate-500 p-5 py-2 mx-2 w-fit my-5 bg-slate-900 text-white font-bold rounded-3xl'
              >
                Create your BitTree
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="col2 w-full h-screen bg-[#E9C0E9]">
        <img className='h-full object-contain' src="/generate.png" alt="Generate your links" />
        <ToastContainer />
      </div>
    </div>
  )
}

export default Generate
