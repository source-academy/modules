const initRapier = async () => {
  let r = await import('@dimforge/rapier3d-compat');
  await r.init();
  return r;
};

export default initRapier;
