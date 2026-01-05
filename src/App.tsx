import { useState } from "react";
import { CloudUpload, Trash2, FileVideo } from "lucide-react";

type UploadFile = {
  file: File;
  id: string;
};

export default function App() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  function handleSelectFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files).map((file) => ({
      file,
      id: crypto.randomUUID(),
    }));

    setFiles((prev) => [...prev, ...selectedFiles]);
  }

  function removeFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleUpload() {
    if (files.length === 0) return;

    const formData = new FormData();
    formData.append("video", files[0].file);

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3333/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        throw new Error(errBody?.error ?? `Erro HTTP: ${response.status}`);
      }
      alert("Upload realizado com sucesso");

      const data = await response.json();
      console.log(data);

      // setFiles([]);
    } catch (err: any) {
      alert("Erro ao enviar arquivo" + err);
      console.log(err);
      console.log("Erro ao enviar arquivo" + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-100 flex items-center justify-center px-4">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-lg font-semibold text-zinc-800 mb-4">
          Upload Files
        </h1>

        {/* Upload area */}
        <label
          htmlFor="fileinput"
          className="flex flex-col items-center justify-center gap-3 border border-dashed border-zinc-300 rounded-xl px-6 py-10 cursor-pointer hover:bg-zinc-50 transition"
        >
          <CloudUpload className="w-8 h-8 text-zinc-500" />
          <span className="text-sm text-zinc-600">
            Drop your files here or <span className="underline">browse</span>
          </span>
          <span className="text-xs text-zinc-400">
            Max file size up to 100mb
          </span>

          <input
            id="fileinput"
            type="file"
            accept="video/*"
            multiple={false}
            hidden
            onChange={handleSelectFiles}
          />
        </label>

        {/* File list */}
        <div className="mt-5 space-y-3">
          {files.map(({ file, id }) => (
            <div
              key={id}
              className="flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <FileVideo className="w-5 h-5 text-zinc-500" />
                <div className="text-sm">
                  <p className="text-zinc-700 font-medium truncate max-w-45">
                    {file.name}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>

              <button
                onClick={() => removeFile(id)}
                className="text-zinc-400 hover:text-red-500 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Action */}
        <button
          onClick={handleUpload}
          disabled={loading || files.length === 0}
          className="mt-6 w-full bg-black text-white text-sm font-medium py-2.5 rounded-xl hover:bg-zinc-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading..." : "Next"}
        </button>
      </section>
    </main>
  );
}
