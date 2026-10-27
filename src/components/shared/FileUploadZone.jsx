import React, { useState, useRef } from 'react';
import { useAppState } from '../../contexts/StateContext';
import { Upload, X, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

export default function FileUploadZone({ activeMilestone, onUploadComplete, onCancel }) {
  const { uploadDocument, milestones } = useAppState();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [docName, setDocName] = useState('');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(activeMilestone ? activeMilestone.id : '');
  const [uploaderNotes, setUploaderNotes] = useState('');
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const fileInputRef = useRef(null);
  const { milestones: allMilestones, currentUser } = useAppState();

  // Filter milestones for this user group
  const groupMilestones = allMilestones.filter(m => m.groupId === (currentUser?.groupId || 'group1'));

  const allowedExtensions = ['pdf', 'docx', 'doc', 'pptx', 'ppt', 'png', 'jpg', 'jpeg'];

  const validateAndSetFile = (file) => {
    setValidationError('');
    if (!file) return;

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 10) {
      setValidationError('Institutional file exchange limits exceeded. Maximum size is 10MB.');
      return;
    }

    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setValidationError(`Invalid file extension: .${ext}. Whitelisted formats include: PDF, DOCX, PPTX, PNG, JPG.`);
      return;
    }

    setSelectedFile(file);
    setDocName(file.name);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setDocName('');
    setProgress(0);
    setIsUploading(false);
    setValidationError('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setValidationError('Select an academic draft file to submit.');
      return;
    }
    if (!selectedMilestoneId) {
      setValidationError('Associate your submission with a target review milestone.');
      return;
    }

    setIsUploading(true);
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        
        // Execute real upload write to context
        uploadDocument(
          docName,
          selectedMilestoneId,
          (selectedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
          uploaderNotes
        );

        setIsUploading(false);
        if (onUploadComplete) onUploadComplete();
      }
    }, 150);
  };

  return (
    <div className="bg-surface border border-ink/10 rounded-none p-5 shadow-premium text-text-primary text-xs space-y-4">
      
      <div className="flex justify-between items-center border-b border-ink/10 pb-3">
        <h3 className="font-serif text-sm font-bold flex items-center text-ink gap-2">
          <Upload className="w-4 h-4 text-accent" />
          Upload Research Artifact
        </h3>
        <button onClick={onCancel} className="p-1 hover:bg-slate-100 text-muted transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2 font-mono">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Selected Milestone dropdown */}
        <div className="space-y-1">
          <label className="academic-label block text-[10px]">
            Target review milestone *
          </label>
          <select 
            value={selectedMilestoneId}
            onChange={(e) => setSelectedMilestoneId(e.target.value)}
            required
            className="w-full h-10 px-3 rounded-none border border-ink/10 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent font-sans text-xs transition-colors duration-150"
          >
            <option value="">-- Choose Milestone Track --</option>
            {groupMilestones.map(m => (
              <option key={m.id} value={m.id}>
                Milestone {m.order}: {m.title} ({m.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Doc Display input overrides */}
        <div className="space-y-1">
          <label className="academic-label block text-[10px]">
            Document Label *
          </label>
          <input 
            type="text" 
            required
            placeholder="e.g. Coursework_Assignment_Submission.pdf"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            className="w-full h-10 px-3 rounded-none border border-ink/10 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent text-xs transition-colors duration-150"
          />
        </div>

        {/* Drag/Drop primary surface container */}
        {!selectedFile ? (
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className={`cursor-pointer border border-dashed rounded-none h-44 flex flex-col items-center justify-center space-y-2.5 transition-all text-center px-4 ${
              dragActive 
                ? 'border-accent bg-emerald-50/20' 
                : 'border-ink/20 bg-slate-50 hover:bg-white hover:border-accent'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              accept=".pdf,.docx,.doc,.pptx,.ppt,.png,.jpg,.jpeg"
            />
            <div className="p-2.5 bg-slate-100 text-ink border border-ink/5">
              <Upload className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-semibold text-ink text-xs">Drag & drop your file here</p>
              <p className="text-muted mt-1 text-[11px]">or <span className="text-accent underline font-semibold">browse files</span> from disk</p>
            </div>
            <p className="text-[10px] text-muted font-mono tracking-tight">
              Permitted formats: PDF, DOCX, PPTX (Max 10MB)
            </p>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 rounded-none border border-ink/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-5 h-5 text-ink flex-shrink-0" />
                <div className="truncate max-w-[200px] md:max-w-xs">
                  <p className="font-bold truncate text-ink text-xs">{selectedFile.name}</p>
                  <p className="text-[10px] text-muted font-mono">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              {!isUploading && (
                <button 
                  type="button" 
                  onClick={removeSelectedFile}
                  className="p-1 hover:bg-slate-200 text-muted hover:text-ink cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Simulative Upload Progress slider */}
            {isUploading && (
              <div className="space-y-1.5 font-mono">
                <div className="flex justify-between text-[10px] font-bold text-accent">
                  <span>TRANSMITTING FILE SECURELY</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1 overflow-hidden">
                  <div className="bg-accent h-full transition-all duration-150" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}
            
            {!isUploading && progress === 100 && (
              <div className="flex items-center text-[10px] text-accent font-bold space-x-1 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>INTEGRITY CLEARANCE VERIFIED</span>
              </div>
            )}
          </div>
        )}

        {/* Textarea for comments */}
        <div className="space-y-1">
          <label className="academic-label block text-[10px]">
            Notes for supervisor (optional)
          </label>
          <textarea 
            rows={3}
            placeholder="Provide context regarding changes or research highlights..."
            value={uploaderNotes}
            onChange={(e) => setUploaderNotes(e.target.value)}
            maxLength={500}
            className="w-full p-2.5 bg-slate-50 border border-ink/10 rounded-none outline-none focus:bg-white focus:ring-1 focus:ring-accent text-xs transition-colors duration-150"
          />
          <span className="block text-[10px] text-right font-mono text-muted">
            {uploaderNotes.length}/500 chars
          </span>
        </div>

        {/* FORM FOOTER BUTTONS */}
        <div className="flex space-x-2 pt-2 border-t border-ink/10">
          <button 
            type="button" 
            onClick={onCancel}
            disabled={isUploading}
            className="flex-1 h-10 bg-white border border-ink/10 hover:bg-slate-50 font-sans font-semibold text-muted hover:text-ink rounded-none text-xs transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isUploading || !selectedFile}
            className="flex-1 h-10 bg-ink hover:bg-accent text-white font-sans font-semibold rounded-none text-xs transition cursor-pointer disabled:opacity-50"
          >
            {isUploading ? 'Securing Submission...' : 'Submit to Supervisor'}
          </button>
        </div>

      </form>

    </div>
  );
}
