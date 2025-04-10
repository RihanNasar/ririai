# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
  curl https://api.mureka.ai/v1/song/generate \
   -H "Authorization: Bearer op_m94fp730JXBjwr77oMuf7T2GxMji7V7" \
   -H "Content-Type: application/json" \
   -d '{
  "lyrics": "[Verse]\nIn the stormy night, I wander alone\nLost in the rain, feeling like I have been thrown\nMemories of you, they flash before my eyes\nHoping for a moment, just to find some bliss",
  "model": "auto",
  "prompt": "r&b, slow, passionate, male vocal"
  }'
curl  https://5b55-34-87-60-233.ngrok-free.app


# Test POST endpoint
curl -X POST  https://5b55-34-87-60-233.ngrok-free.app \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test music"}'