import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentosService } from '@/services/documentos.service';
import { Upload, Download, Trash2, FileText } from 'lucide-react';
import { DocumentoDto } from '@lexmanager/shared';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentosPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: documentos, isLoading } = useQuery({
    queryKey: ['documentos'],
    queryFn: () => documentosService.list(),
  });

  const deleteMutation = useMutation({
    mutationFn: documentosService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documentos'] }),
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await documentosService.upload(file);
      }
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-bold text-gray-900">Documentos</h1>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleUpload(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`card flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed p-12 transition-colors ${
          isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
        }`}
      >
        <Upload className={`h-10 w-10 ${isDragging ? 'text-primary-600' : 'text-gray-300'}`} />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            {uploading ? 'Enviando...' : 'Arraste arquivos ou clique para selecionar'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Máximo 50 MB por arquivo</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* File list */}
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary-700 border-t-transparent" />
        </div>
      ) : (
        <div className="card divide-y divide-gray-100">
          {documentos?.length === 0 && (
            <p className="py-12 text-center text-sm text-gray-400">Nenhum documento enviado</p>
          )}
          {documentos?.map((doc: DocumentoDto) => (
            <div key={doc.id} className="flex items-center gap-4 px-5 py-3">
              <FileText className="h-8 w-8 text-gray-300 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{doc.nomeOriginal}</p>
                <p className="text-xs text-gray-400">
                  {formatBytes(doc.tamanho)} •{' '}
                  {format(new Date(doc.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={documentosService.getDownloadUrl(doc.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </a>
                <button
                  onClick={() => { if (confirm('Excluir documento?')) deleteMutation.mutate(doc.id); }}
                  className="rounded p-1.5 text-gray-400 hover:bg-red-100 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
