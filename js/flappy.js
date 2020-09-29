function novoElemento(tagname, className) {
    const elem = document.createElement(tagname)
    elem.className = className
    return elem
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')
    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)
    this.setAltura = altura => corpo.style.height = `${altura}px`
}

// const c = new Barreira(true)
// c.setAltura(200)
// document.querySelector('[wm-flappy]').appendChild(c.elemento)

function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)

    }
    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)

}
// const b = new ParDeBarreiras(700, 400, 200)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

function Barreiras(altura, largura, abertura, espaco, notificaPonto) {
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ]
    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            //quando elemento for a sair 
            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }
            const meio = largura / 2
            const cruzoumeio = par.getX() + deslocamento >= meio && par.getX() < meio
            cruzoumeio && notificaPonto()

        });
    }

}

function Passaro(alturaJogo) {
    let voando = false

    this.elemento = new novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/bird.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeyup = e => voando = false

    window.onkeydown = e => voando = true


    this.animar = () => {
        const novoY = this.getY() - (voando ? -8 : 5)
        const alturaMax = alturaJogo - this.elemento.clientHeight
        console.log(alturaMax)

        if (novoY <= 0) {
            this.setY(0)
        }
        else if (novoY >= alturaMax) {
            this.setY(alturaMax)
        }
        else {
            this.setY(novoY)
        }

    }

    this.setY(alturaJogo / 2)
}

function Progresso() {
    this.elemento = new novoElemento('p', 'progresso')
    this.elemento.innerHTML = "0"
    this.notificaPonto = () => {
        this.elemento.innerHTML = parseInt(this.elemento.innerHTML) + 1
    }
}
// const notifica = new Progresso()

// const barreiras = new Barreiras(700, 1200, 400, 400, notifica.notificaPonto)
// const passaro = new Passaro(480)
// const areaJogo = document.querySelector('[wm-flappy]')
// areaJogo.appendChild(passaro.elemento)
// areaJogo.appendChild(notifica.elemento)
// barreiras.pares.forEach(par => areaJogo.appendChild(par.elemento))
// setInterval(() => {
//     barreiras.animar()
//     passaro.animar()
// }, 20);

function sobrePostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top
    console.log(horizontal,vertical)
    return horizontal && vertical
}

function colidiu(passaro, barreiras) {
    let colidiu = false
    barreiras.pares.forEach(par => {
        if (!colidiu) {
            const superior = par.superior.elemento
            const inferior = par.inferior.elemento

            colidiu = sobrePostos(passaro.elemento, superior) || sobrePostos(passaro.elemento, inferior)
           
        }
    })
    
    return colidiu;
}

function FlappyBird() {
    const areaJogo = document.querySelector('[wm-flappy]')
    const altura = areaJogo.clientHeight
    const largura = areaJogo.clientWidth
    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 200, 400, progresso.notificaPonto)
    const passaro = new Passaro(altura)

    areaJogo.appendChild(progresso.elemento)
    areaJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaJogo.appendChild(par.elemento))

    this.start = () => {
        const temporizador =
            setInterval(() => {
                barreiras.animar()
                passaro.animar()
                if (colidiu(passaro, barreiras))
                    clearInterval(temporizador)
            }, 20);
    }
}
new FlappyBird().start()