"use client"
import { useContext, useEffect, useState } from "react";
import { downloadFile, getAllFilesByUserId, uploadFile } from "@/services/api";
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

  async function onDownload(event) {
    event.preventDefault();

    setLoading(true);

    try {
      const data = await downloadFile('15E44655-BE99-49C2-FBC2-08DBD2372EAB', 'FB7EF543-8BAA-4176-4DA2-08DBCFCBB5BF', userInfo.access_token);
      console.log(data);
    } catch (err) {
      setFail(true);
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function onDownloadFile(fileId, fileName) {
    try {
      const response = await downloadFile(fileId, userInfo.userId, userInfo.access_token);
      const blob = new Blob([response]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
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
        uploadFile(userInfo.userId, body, userInfo.access_token)
      } catch (err) {
        console.error(err);
      }
  }
  
  

  return (
    <main className="">
      <ul>
        {userFiles.map(el => (
          <li key={el.id}>
            <p>{el.fileName}</p>
            <button onClick={() => onDownloadFile(el.id, el.fileName)} type="button">downLoad file</button>
          </li>
        ))}
      </ul>

      <div className="wrapper">
        <p>{userInfo.access_token}</p>
        <form onSubmit={uploadUserFile}>

        
          <input
            name="file"
            type="file"
            onChange={(event) => console.log(event.target.value)} />
          <button type="submit">Upload</button>
        </form>

      </div>

    </main>
  );
}




 