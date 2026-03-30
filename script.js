// script.js
let uploadedFiles = [];
let selectedPrinter = null;
let connectionStatus = { wifi: false, bluetooth: false };

const printers = [
    { name: "HP DeskJet 4155e", type: "Inkjet", status: "Online" },
    { name: "Canon PIXMA TS3420", type: "Inkjet", status: "Online" },
    { name: "Epson EcoTank ET-2850", type: "Inkjet", status: "Ready" },
    { name: "Brother HL-L2350DW", type: "Laser", status: "Online" },
    { name: "Samsung Xpress M2020W", type: "Laser", status: "Ready" }
];

const templates = [
    { id: 1, title: "Birthday Invitation", emoji: "🎂", color: "#ff6b6b" },
    { id: 2, title: "Business Card", emoji: "💼", color: "#4ecdc4" },
    { id: 3, title: "Calendar 2026", emoji: "📅", color: "#45b7d1" },
    { id: 4, title: "Thank You Card", emoji: "🙏", color: "#f9ca24" },
    { id: 5, title: "Photo Frame", emoji: "🖼️", color: "#6c5ce7" },
    { id: 6, title: "Wedding Invite", emoji: "💍", color: "#e17055" }
];

// Initialize everything
$(document).ready(function () {
    renderPrinters();
    renderTemplates();
    
    // File input
    $('#select-files').on('click', function () {
        $('#file-input').click();
    });

    $('#file-input').on('change', handleFiles);

    // Drag & Drop
    const dropZone = $('#drop-zone');
    dropZone.on('dragover', function (e) {
        e.preventDefault();
        dropZone.addClass('dragover');
    });
    dropZone.on('dragleave', function () {
        dropZone.removeClass('dragover');
    });
    dropZone.on('drop', function (e) {
        e.preventDefault();
        dropZone.removeClass('dragover');
        handleFiles(e.originalEvent.dataTransfer);
    });

    // Fake printer clicks
    console.log('%c🚀 Smart Printer Web initialized successfully!', 'color:#00bfff;font-weight:bold');
});

// Handle uploaded files
function handleFiles(e) {
    let files;
    if (e.target && e.target.files) {
        files = e.target.files;
    } else if (e.files) {
        files = e.files;
    } else return;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (ev) {
            uploadedFiles.push({
                id: Date.now() + Math.random(),
                name: file.name,
                type: file.type,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                preview: file.type.startsWith('image/') ? ev.target.result : null
            });
            renderPreviews();
        };
        if (file.type.startsWith('image/')) {
            reader.readAsDataURL(file);
        } else {
            // For non-image files show generic preview
            uploadedFiles.push({
                id: Date.now() + Math.random(),
                name: file.name,
                type: file.type,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                preview: null
            });
            renderPreviews();
        }
    });
}

// Render file previews
function renderPreviews() {
    const grid = $('#preview-grid');
    grid.empty();
    $('#preview-section').removeClass('d-none');
    $('#file-count').text(uploadedFiles.length + ' files');

    uploadedFiles.forEach((file, index) => {
        const html = `
        <div class="col-6 col-md-4 col-lg-3 preview-item">
            <div class="card bg-secondary border-0 h-100">
                ${file.preview 
                    ? `<img src="${file.preview}" class="card-img-top" style="height:140px;object-fit:cover;" alt="${file.name}">` 
                    : `<div class="card-img-top d-flex align-items-center justify-content-center bg-dark" style="height:140px;">
                        <span class="fs-1">📄</span>
                       </div>`}
                <div class="card-body p-3">
                    <p class="small mb-1 text-truncate">${file.name}</p>
                    <p class="small text-muted">${file.size}</p>
                    <button onclick="removeFile(${index})" class="remove-btn">✕</button>
                </div>
            </div>
        </div>`;
        grid.append(html);
    });

    if (uploadedFiles.length > 0) {
        $('.fixed-bottom').removeClass('d-none');
    }
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    renderPreviews();
}

// Render printer list
function renderPrinters() {
    const list = $('#printer-list');
    printers.forEach((printer, i) => {
        const html = `
        <a href="#" onclick="selectPrinter(${i}); return false" class="list-group-item list-group-item-action bg-dark border-secondary d-flex justify-content-between align-items-center">
            <div>
                <strong>${printer.name}</strong><br>
                <small class="text-muted">${printer.type}</small>
            </div>
            <span class="badge bg-success">${printer.status}</span>
        </a>`;
        list.append(html);
    });
}

function selectPrinter(i) {
    selectedPrinter = printers[i];
    $('.list-group-item').removeClass('active border-primary');
    $('.list-group-item').eq(i).addClass('active border-primary');
    $('#print-status').text('Connected to ' + selectedPrinter.name);
}

// Toggle connection
function toggleConnection(type) {
    connectionStatus[type] = !connectionStatus[type];
    const btn = $('#' + type + '-btn');
    if (connectionStatus[type]) {
        btn.removeClass('btn-outline-info').addClass('btn-info');
        btn.html(type === 'wifi' ? '📡 Connected' : '🔵 Connected');
    } else {
        btn.removeClass('btn-info').addClass('btn-outline-info');
        btn.html(type === 'wifi' ? '📡 Wi-Fi' : '🔵 Bluetooth');
    }
}

// Render templates
function renderTemplates() {
    const grid = $('#template-grid');
    templates.forEach(t => {
        const html = `
        <div class="col-6 col-sm-4 col-md-3 col-lg-2">
            <div class="template-card card bg-dark border-0 shadow-sm text-center" onclick="useTemplate(${t.id})">
                <div class="card-body d-flex flex-column align-items-center justify-content-center" style="background: ${t.color}20; border-radius: 16px;">
                    <div class="fs-1 mb-3">${t.emoji}</div>
                    <h6>${t.title}</h6>
                </div>
            </div>
        </div>`;
        grid.append(html);
    });
}

function useTemplate(id) {
    // Simulate loading a template into preview
    const template = templates.find(t => t.id === id);
    alert(`✅ Loaded template: ${template.title}\n\nYou can now print beautiful ${template.title.toLowerCase()}s!`);
    // In a real app this would add a preview card
}

// Main print function
function startPrinting() {
    if (uploadedFiles.length === 0) {
        alert("📤 Please upload at least one file first!");
        return;
    }
    if (!selectedPrinter) {
        alert("🔌 Please select a printer first!");
        return;
    }

    // Show loading animation
    const btn = document.querySelector('button[onclick="startPrinting()"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2"></span>
        Printing to ${selectedPrinter.name}...
    `;
    btn.disabled = true;

    // Simulate printing process
    setTimeout(() => {
        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();
        
        // Reset button
        btn.innerHTML = originalText;
        btn.disabled = false;
        
        // Clear files after successful print (demo)
        uploadedFiles = [];
        $('#preview-section').addClass('d-none');
        $('#preview-grid').empty();
        $('#print-status').text('Ready');
    }, 2800);
}

// Keyboard shortcut (Ctrl/Cmd + P) simulation
document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        startPrinting();
    }
});
