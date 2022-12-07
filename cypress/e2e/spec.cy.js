describe('Equivocal Pixel Chimney browser tests', () => {
  it('visits the page', () => {
    cy.visit('https://quargsgreene.github.io/equivocal-pixel-chimney/dist/index.html');
  });

  it('displays the canvas', () => {
    cy.get('#play').click();
  });
});
