"use client"
import { useContext, useEffect, useState } from "react";
import { deleteFileById, downloadFile, getAllFilesByUserId, uploadFile } from "@/services/api";
import { Context } from "@/app/layout";
import { useRouter } from "next/navigation";
export default function FileService() {


  const { isLoading, setLoading } = useContext(Context);
  const [isFailed, setFail] = useState(false);
  const [userFiles, setUserFiles] = useState([]);
  const key = "userInfo"

  const [userInfo, setInfo] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(key));
    if (data) {
      setInfo(data)
      getFiles(data.userId, data.access_token);
      console.log(data);
    }


  }, [key]);

  const router = useRouter();


  async function getFiles(userId, token) {
    try {
      console.log(userInfo);
      const files = await getAllFilesByUserId(userId, token);
      console.log(files.value);
      setUserFiles(files.value);
    }
    catch (err) {
      console.log(err.message);
    }

  }


  async function onDownloadFile(fileId, fileName, fileType) {
    try {
      const response = await downloadFile(fileId, userInfo.userId, userInfo.access_token);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        link.style.display = 'none';
  
        document.body.appendChild(link);
        link.click();
  
        document.body.removeChild(link);
      } else {
        console.error('Error downloading file:', response.statusText);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }
  
  async function onDeleteFile(fileId)
  {
    try{
        await deleteFileById(fileId, userInfo.userId, userInfo.access_token);
         getFiles(userInfo.userId, userInfo.access_token);
    }
    catch(err){
        console.log(err)
    }
  }

  async function uploadUserFile(e) {
    e.preventDefault();

    const files = e.target.file.files;

    if (files.length === 0) {
      console.log("No files selected");
      return;
    }

    const body = new FormData();

    body.append("file", files[0]);

    try {
      await uploadFile(userInfo.userId, body, userInfo.access_token);
      await getFiles(userInfo.userId, userInfo.access_token);
    } catch (err) {
      console.error(err);
    }
  }



  return (
    <main className="">
      <ul>
        {userFiles.map(el => (
          <li key={el.id}>
            <p style={{color:"white"}}>{el.fileName}</p>
            <button onClick={() => onDownloadFile(el.id, el.fileName, el.contentType)} type="button">downLoad file</button>
            <button onClick={() => onDeleteFile(el.id)} type = "button">delete file</button>
          </li>
        ))}
      </ul>
      <form onSubmit={uploadUserFile}>
        <input
          style={{color:"white"}}
          name="file"
          type="file"
          onChange={(event) => console.log(event.target.value)} />
        <button type="submit">Upload</button>
      </form>
    </main>
  );
}




