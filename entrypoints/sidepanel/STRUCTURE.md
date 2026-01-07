# Struktur Folder Sidepanel

## Overview

Sidepanel application telah direfactor menjadi struktur komponen yang modular dan mudah dimaintain.

## Struktur File

```
entrypoints/sidepanel/
├── App.tsx                 # Main component - orchestrate semua logic
├── main.tsx               # Entry point React
├── index.html             # HTML template
├── style.css              # Global styles & Tailwind directives
│
├── components/            # Reusable UI components
│   ├── WelcomeScreen.tsx  # Welcome state - tampil saat buka atau loading
│   ├── ChatArea.tsx       # Chat messages display dengan timestamp detection
│   ├── LoadingBubble.tsx  # Loading animation bubble
│   └── InputArea.tsx      # Input field + Reset button
│
└── hooks/                 # Custom React hooks
    └── useTranscript.ts   # Handle transcript loading & video detection
```

## Fitur Utama

### 1. Welcome Screen

- Tampil saat pertama kali buka extension
- Tampil saat loading transcript dengan animasi bouncing dots
- Memberitahu user untuk buka video YouTube

### 2. Auto-load Transcript

- Deteksi otomatis perubahan URL YouTube
- Loading state dengan feedback visual
- Reset chat saat video berubah

### 3. Chat Interface

- Chat bubble modern dengan Tailwind
- User message: blue bubble (kanan)
- AI message: white bubble (kiri)
- Timestamp detection: click untuk jump ke timestamp di video

### 4. Loading States

- Transcript loading: Welcome screen dengan animasi
- Chat loading: LoadingBubble component di chat area
- Prevent double-send: Input disabled saat loading

### 5. Reset Button

- Subtle button di input area
- Reset chat history & transcript
- Hanya visible saat ada transcript

## Component Responsibilities

### `App.tsx`

- Manage overall state (messages, input, loading)
- Orchestrate antara hook & components
- Handle send message, jump timestamp, reset
- Determine UI state (welcome, loading, chat)

### `WelcomeScreen.tsx`

- Display welcome message atau loading indicator
- Animated dots loading
- Responsive gradient background

### `ChatArea.tsx`

- Display pesan history
- Timestamp detection & clickable buttons
- LoadingBubble saat AI mengetik
- Auto-scroll ke pesan terbaru

### `LoadingBubble.tsx`

- Animated 3-dot loading indicator
- Customizable speed (slow, normal, fast)
- Match chat bubble styling

### `InputArea.tsx`

- Input field dengan Enter support
- Send button dengan icon
- Reset button
- Loading status text
- Disabled state handling

### `useTranscript.ts`

- Fetch transcript dari YouTube video
- Poll URL setiap 1.5 detik untuk deteksi perubahan
- Return: transcript, loading, error, videoId, reset function
- Isolated logic dari UI

## Styling Approach

- **Tailwind CSS**: Seluruh styling pakai utility classes
- **Responsive**: Mobile-first approach
- **Rounded corners**: Chat bubble (rounded-3xl) dengan subtle pointer
- **Colors**:
  - Red/Orange: Brand colors
  - Blue: User messages
  - White/Gray: AI messages & UI elements

## State Management

```
App.tsx (Parent)
├── messages: Message[] - history chat
├── input: string - current input value
├── loading: boolean - AI response loading
├── { transcript, loading, videoId } - dari useTranscript hook
```

## Key Improvements dari Versi Sebelumnya

✅ Component separation - lebih mudah di-maintain
✅ Custom hooks - logic terpisah dari UI
✅ Welcome screen - better UX saat pertama kali
✅ Loading animations - visual feedback yang lebih baik
✅ Reset functionality - fresh start untuk video baru
✅ Timestamp detection di ChatArea (bukan App.tsx)
✅ Better disabled state - tidak bisa chat saat loading
✅ Modern styling - Tailwind utilities + custom animations
✅ Auto-scroll - smooth scrolling ke pesan terbaru
