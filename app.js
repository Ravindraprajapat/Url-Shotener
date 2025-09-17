import { createServer } from 'http'
import { promises as fs } from 'fs'
import path from 'path'
import chalk from 'chalk'
import crypto from 'crypto'

const PORT = 3002

const DATA_FILE = path.join("data","links.json")

const serverFile = async ( res , filePath , contentType) => {
  try {
    const data = await fs.readFile(filePath)
    res.writeHead(200, { 'Content-Type': contentType})
    res.end(data)
  } catch (error) {
    res.writeHead(404, { 'Content-Type': contentType })
    res.end('<h1>404 page not found</h1>')
  }
}

const loadLinks = async () => {
  try{
  const data = await fs.readFile(DATA_FILE, 'utf-8')
  return JSON.parse(data)
  }
  catch (error){
    if(error.code ==="ENOENT"){
      await fs.writeFile(DATA_FILE,JSON.stringify({}))
      return {}
    }
    throw error
  }
}

const saveLinks = async (links) => {
  await fs.writeFile(DATA_FILE,JSON.stringify(links));
}

const server = createServer(async (req, res) => {
  if (req.method === 'GET') {
    if (req.url === '/') {
      return serverFile (res ,
        path.join('public', 'index.html'),
     'text/html'
    )
    } else if (req.url === '/style.css') {
         return serverFile (res ,
        path.join('public', 'style.css'),
     'text/css'
    )   
    } else if(req.url==="/links"){
         const links = await loadLinks();
         res.writeHead(200 ,{"Content-Type" : "application/json"})
         return res.end(JSON.stringify(links))
    }
    else{
      const links = await loadLinks();
      const shortCode = req.url.slice(1)
      if(links[shortCode]){
        res.writeHead(302,{location : links[shortCode]})
        return res.end();
      }
      res.writeHead(404,{"Content-Type" : "text/plain"})
      return res.end("Shortened URL is Not Found")
    }
  }

  if(req.method === "POST" && req.url ==="/shorten"){
  
    const links = await loadLinks();

    let body ="";
    req.on("data" ,(chunk) =>(body+=chunk))

    req.on(  'end',  async ()=>{
      console.log(body);
      const {url , shortCode} = JSON.parse(body)
      if(!url){
        res.writeHead(400,{"Content-Type" : "text/plain"});
        return res.end("URL is required")
      }

        const finalShortCode = shortCode || crypto.randomBytes(4).toString("hex")
         if(links[finalShortCode]){
            res.writeHead(400,{"Content-Type" : "text/plain"});
        return res.end("Short Code already exist . please choose another")
         }

         links[finalShortCode] = url
         await saveLinks(links);

          res.writeHead(200,{"Content-Type" : "application/json"});
          res.end( JSON.stringify({success : true ,shortCode : finalShortCode}))
    })
  }
})
server.listen(PORT, () => {
  console.log( chalk.green( `Server running at http://localhost:${PORT}`))
})
