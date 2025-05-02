document.getElementById('pdfForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData();
  const files = document.getElementById('pdfFiles').files;
  for (let i = 0; i < files.length; i++) {
    if (files[i].type !== 'application/pdf') {
      alert('Only PDF files are allowed!');
      return;
    }
    formData.append('pdfs', files[i]);
  }

  // Show loading spinner
  document.getElementById('loadingSpinner').classList.remove('hidden');
  document.getElementById('downloadLink').classList.add('hidden');

  try {
    const response = await fetch('http://localhost:3000/merge_pdfs', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const downloadLink = document.getElementById('downloadBtn');
      downloadLink.href = url;

      // Open the merged PDF in a new tab
      window.open(url, '_blank');
      
      // Optionally, show the download link (for manual download if needed)
      document.getElementById('downloadLink').classList.remove('hidden');
    } else {
      alert('Error merging PDFs: ' + response.statusText);
    }
  } catch (err) {
    console.error('Fetch error:', err);
    alert('Failed to merge PDFs. Please try again.');
  } finally {
    document.getElementById('loadingSpinner').classList.add('hidden');
  }
});
