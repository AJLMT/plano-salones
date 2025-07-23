import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DragDropModule } from '@angular/cdk/drag-drop';

interface Mesa {
  id: number;
  tipo: 'rect' | 'circle';
  x: number;
  y: number;
  width: number;
  height: number;
  numero: string;
  comensales: string;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './main.html',
  styleUrls: ['./main.css']
})
export class MainComponent implements OnInit {
  salones = [
    { name: 'Salón 1', path: '../assets/salones/salon1.jpg' },
    { name: 'Salón 2', path: '../assets/salones/salon2.jpg' }
  ];
  selectedSalon = this.salones[0];

  mesas: Mesa[] = [];
  private mesaIdCounter = 1;
  selectedMesa: Mesa | null = null;

  // Datos para nuevas mesas
  nuevaMesaTipo: 'rect' | 'circle' = 'circle';
  nuevaMesaWidth = 50;
  nuevaMesaHeight = 50;

  ngOnInit() {
    this.checkSession();

  // Comprobar cada 30 segundos
    const saved = localStorage.getItem('mesas');
    if (saved) {
      this.mesas = JSON.parse(saved);
      this.mesaIdCounter = this.mesas.length + 1;
    }

    setInterval(() => {
      this.checkSession();
    }, 30000);
  }

  saveState() {
    localStorage.setItem('mesas', JSON.stringify(this.mesas));
  }

  addMesa() {
    this.mesas.push({
      id: this.mesaIdCounter++,
      tipo: this.nuevaMesaTipo,
      x: 50,
      y: 50,
      width: this.nuevaMesaWidth,
      height: this.nuevaMesaHeight,
      numero: '',
      comensales: ''
    });
    this.saveState();
  }

  selectMesa(mesa: Mesa) {
    this.selectedMesa = mesa;
  }

  deleteMesa() {
    if (this.selectedMesa) {
      this.mesas = this.mesas.filter(m => m.id !== this.selectedMesa!.id);
      this.selectedMesa = null;
      this.saveState();
    }
  }

  updateMesaPosition(mesa: Mesa, event: any) {
    mesa.x = event.source.getFreeDragPosition().x;
    mesa.y = event.source.getFreeDragPosition().y;
    this.saveState();
  }

  downloadState() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.mesas));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `plano_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  loadState(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        this.mesas = JSON.parse(e.target.result);
        this.mesaIdCounter = this.mesas.length + 1;
        this.saveState();
      } catch (err) {
        alert('Error al cargar el archivo');
      }
    };
    reader.readAsText(file);
  }

  async downloadAsImage() {
    const plano = document.querySelector('.plano-container') as HTMLElement;
    if (!plano) return;

    const canvas = await html2canvas(plano, { backgroundColor: '#ffffff' });
    const link = document.createElement('a');
    link.download = 'plano.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
  }

  async downloadAsPDF() {
    const plano = document.querySelector('.plano-container') as HTMLElement;
    if (!plano) return;

    const canvas = await html2canvas(plano, { backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/jpeg');

    const pdf = new jsPDF('landscape', 'px', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
    pdf.save('plano.pdf');
  }

  checkSession() {
    const lastLogin = localStorage.getItem('lastLoginTime');
    const maxSessionTime = 5 * 60 * 1000; // 5 minutos

    if (!lastLogin || Date.now() - parseInt(lastLogin) > maxSessionTime) {
      alert('Tu sesión ha caducado. Por favor, vuelve a iniciar sesión.');
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('lastLoginTime');
      window.location.href = '/login'; // Redirigir al login
    }
  }

  clearMesas() {
    this.mesas = [];
    this.selectedMesa = null;
    this.mesaIdCounter = 1;
    this.saveState();
  }

  onSalonChange() {
    this.clearMesas();
  }
}
