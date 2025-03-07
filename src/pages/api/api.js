// export const BASE_URL = `http://10.5.50.125:8000/`;
export const BASE_URL = `https://ponahealth.keltech.co.tz/`

export const login = async (data)=>{
    const res = await fetch(`${BASE_URL}api/token/`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data)
    })
    const body = await res.json()
    return body;
}





export const addDoctorApplication = async (data)=>{
    // alert(JSON.stringify(data))
    // return;
    const res = await fetch(`${BASE_URL}api/v1/application/`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data)
    })
    const body = await res.json()
    return body;
}



export const getDoctorApplication = async (user_id)=>{
    // alert(JSON.stringify(`${BASE_URL}api/v1/application_read/?user_id=${user_id}/`))
    let url = `${BASE_URL}api/v1/application_read/?user_id=${user_id}`
    // alert(url);

    // return;
    const res = await fetch(url,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
        },
    })
    const body = await res.json()
    return body;
}


export const updateDoctorApplication = async (data)=>{
    // alert(JSON.stringify(`${BASE_URL}api/v1/application_read/?user_id=${user_id}/`))
    let url = `${BASE_URL}api/v1/application_read/${data.id}/`
    // alert(JSON.stringify(data));

    // alert(url)

    // return;
    const res = await fetch(url,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify(data)
    })
    const body = await res.json()
    return body;
}




export const getDoctorApplications = async (data)=>{
    // alert(JSON.stringify(`${BASE_URL}api/v1/application_read/?user_id=${user_id}/`))
    // alert(data.slug)
    let url = `${BASE_URL}api/v1/application_read/?slug=${data.slug}`
    // alert(url);

    // return;
    const res = await fetch(url,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
        },
    })
    const body = await res.json()
    return body;
}

export const getSpeciality = async ()=>{
    const res = await fetch(`${BASE_URL}api/v1/specialist/`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
        },
    })
    const body = await res.json()
    return body;
}


export const getConsultationTypes = async ()=>{
    const res = await fetch(`${BASE_URL}api/v1/consultation_category/`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
        },
    })
    const body = await res.json()
    return body;
}

export const getCountry = async ()=>{
    const res = await fetch(`${BASE_URL}api/v1/country/`,{
        method:"GET",
        headers:{
            "Content-Type":"application/json",
        },
    })
    const body = await res.json()
    return body;
}



export const addNewDoctor = async (data)=>{
    let form = JSON.stringify(data)
    // alert(JSON.stringify(form))

    const res = await fetch(`${BASE_URL}api/v1/profile/`,{

        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:form
    })
    const body = await res.json()
    return body;
}



export const updateDoctorDetails= async ({formData,editingDoctor})=>{
    let form = JSON.stringify(formData)
    const res = await fetch(`${BASE_URL}api/v1/profile/${editingDoctor.id}/`,{

        method:"PUT",
        headers:{
            "Content-Type":"application/json",
        },
        body:form
    })
    const body = await res.json()
    return body;
}


export const deleteDoctor = async (id)=>{

    const res = await fetch(`${BASE_URL}api/v1/profile/${id}/`,{

        method:"DELETE",
        headers:{
            "Content-Type":"application/json",
        },
    })
    const body = await res.json()
    return body;
}


export const getDoctors = async (data)=>{
   
    // alert(`${BASE_URL}api/v1/profile_read/?slug=${data.slug}&country=${data.origin}`)
    const res = await fetch(`${BASE_URL}api/v1/profile_read/?slug=${data.slug}&country=${data.origin}`,{
        method:"GET",
    })
    const body = await res.json()
    return body;
}