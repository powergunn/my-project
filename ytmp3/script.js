const youtubeUrl = document.getElementById('youtube_url');
        const checkBtn = document.getElementById('checkVideo');
        const videoInfo = document.getElementById('videoInfo');
        const qualitySelector = document.getElementById('qualitySelector');
        const convertBtn = document.getElementById('convertBtn');
        const converterForm = document.getElementById('converterForm');

        // Check video info
        checkBtn.addEventListener('click', function() {
            const url = youtubeUrl.value.trim();
            if (!url) {
                alert('Masukkan URL YouTube terlebih dahulu');
                return;
            }

            checkBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            checkBtn.disabled = true;

            // Reset thumbnail loading state
            const thumbnailContainer = document.querySelector('.thumbnail-container');
            
            // Recreate the inner HTML to reset the image and loading state fully
            thumbnailContainer.innerHTML = '<div class="thumbnail-loading"><i class="fas fa-spinner fa-spin"></i></div><img id="videoThumbnail" class="w-full h-full rounded object-cover hidden" alt="Video Thumbnail" onload="this.classList.remove(\'hidden\'); this.parentElement.querySelector(\'.thumbnail-loading\').style.display=\'none\';" onerror="this.parentElement.innerHTML=\'<div class=\\\'thumbnail-error w-full h-full rounded\\\'><i class=\\\'fas fa-image\\\'></i></div>\';">';
            // Re-get the elements after recreation
            const newThumbnail = document.getElementById('videoThumbnail');

            fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'action=get_info&youtube_url=' + encodeURIComponent(url)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    newThumbnail.src = data.thumbnail;
                    document.getElementById('videoTitle').textContent = data.title;
                    document.getElementById('videoDuration').innerHTML = '<i class="fas fa-clock mr-1"></i>' + data.duration;
                    
                    videoInfo.classList.add('show');
                    qualitySelector.classList.add('show');
                    convertBtn.disabled = false;
                } else {
                    alert('Error: ' + data.error);
                    // Reset thumbnail on error
                    thumbnailContainer.innerHTML = '<div class="thumbnail-error w-full h-full rounded"><i class="fas fa-exclamation-triangle"></i></div>';
                    // Hide info and quality selectors on error
                    videoInfo.classList.remove('show');
                    qualitySelector.classList.remove('show');
                    convertBtn.disabled = true;
                }
            })
            .catch(error => {
                alert('Terjadi kesalahan: ' + error.message);
                thumbnailContainer.innerHTML = '<div class="thumbnail-error w-full h-full rounded"><i class="fas fa-exclamation-triangle"></i></div>';
                // Hide info and quality selectors on error
                videoInfo.classList.remove('show');
                qualitySelector.classList.remove('show');
                convertBtn.disabled = true;
            })
            .finally(() => {
                checkBtn.innerHTML = '<i class="fas fa-search"></i>';
                checkBtn.disabled = false;
            });
        });

        // Convert form
        converterForm.addEventListener('submit', function(e) {
            const url = youtubeUrl.value.trim();
            const quality = document.getElementById('quality').value;

            if (!url) {
                e.preventDefault();
                alert('Masukkan URL YouTube terlebih dahulu');
                return;
            }

            document.getElementById('hiddenUrl').value = url;
            document.getElementById('hiddenQuality').value = quality;

            const btnText = document.querySelector('.btn-text');
            const loading = document.querySelector('.loading');
            
            btnText.textContent = 'Sedang Konversi...';
            loading.classList.add('show');
            convertBtn.disabled = true;
        });

        // Auto-paste from clipboard (hanya jika URL terlihat seperti YouTube)
        youtubeUrl.addEventListener('focus', function() {
            if (navigator.clipboard) {
                navigator.clipboard.readText().then(function(text) {
                    // Cek apakah teks yang ditempelkan adalah URL YouTube
                    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
                    if (youtubeRegex.test(text)) {
                        youtubeUrl.value = text;
                    }
                }).catch(function() {
                    // Clipboard access denied or other error
                });
            }
        });
