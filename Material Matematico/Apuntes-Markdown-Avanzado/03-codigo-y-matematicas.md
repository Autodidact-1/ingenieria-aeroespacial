# 03 · Código y matemáticas (LaTeX avanzado)

## Bloques de código con resaltado de sintaxis

Usa tres backticks seguidos del nombre del lenguaje:

````markdown
```python
def empuje(masa_flujo, velocidad_salida, velocidad_entrada):
    return masa_flujo * (velocidad_salida - velocidad_entrada)
```
````

```python
def empuje(masa_flujo, velocidad_salida, velocidad_entrada):
    return masa_flujo * (velocidad_salida - velocidad_entrada)
```

```matlab
% Ecuación de Tsiolkovski
dv = Isp * g0 * log(m0 / mf);
```

## Matemáticas en línea

Para LaTeX en línea se usa `$...$`:

```markdown
La ecuación del cohete de Tsiolkovski es $\Delta v = I_{sp} g_0 \ln(m_0/m_f)$.
```

La ecuación del cohete de Tsiolkovski es $\Delta v = I_{sp} g_0 \ln(m_0/m_f)$.

## Matemáticas en bloque

Con `$$...$$` para centrar y separar la ecuación:

```markdown
$$
F = m a
$$
```

$$
F = m a
$$

## Ecuaciones multilínea alineadas (`align`)

Requiere el paquete `amsmath` (Pandoc/LaTeX real) o un renderizador MathJax/KaTeX
(Obsidian, VSCode con extensión Markdown+Math, GitHub ya lo soporta):

```markdown
$$
\begin{aligned}
L &= \tfrac{1}{2} \rho V^2 S C_L \\
D &= \tfrac{1}{2} \rho V^2 S C_D \\
E &= \frac{L}{D}
\end{aligned}
$$
```

$$
\begin{aligned}
L &= \tfrac{1}{2} \rho V^2 S C_L \\
D &= \tfrac{1}{2} \rho V^2 S C_D \\
E &= \frac{L}{D}
\end{aligned}
$$

## Matrices

```markdown
$$
\mathbf{R} =
\begin{bmatrix}
\cos\theta & -\sin\theta & 0 \\
\sin\theta & \cos\theta & 0 \\
0 & 0 & 1
\end{bmatrix}
$$
```

$$
\mathbf{R} =
\begin{bmatrix}
\cos\theta & -\sin\theta & 0 \\
\sin\theta & \cos\theta & 0 \\
0 & 0 & 1
\end{bmatrix}
$$

## Sistemas de ecuaciones (`cases`)

```markdown
$$
\dot{x} =
\begin{cases}
v \cos\gamma & \text{si } h < h_0 \\
v \cos\gamma - w & \text{si } h \geq h_0
\end{cases}
$$
```

$$
\dot{x} =
\begin{cases}
v \cos\gamma & \text{si } h < h_0 \\
v \cos\gamma - w & \text{si } h \geq h_0
\end{cases}
$$

## Vectores, derivadas e integrales comunes en mecánica de vuelo

```markdown
$$
\vec{F} = \frac{d\vec{p}}{dt}, \qquad
\int_0^T T(t)\,dt = m_0 - m_f, \qquad
\nabla \cdot \vec{V} = 0
$$
```

$$
\vec{F} = \frac{d\vec{p}}{dt}, \qquad
\int_0^T T(t)\,dt = m_0 - m_f, \qquad
\nabla \cdot \vec{V} = 0
$$

## Notas de compatibilidad

- **GitHub**: soporta `$...$` y `$$...$$` de forma nativa desde 2022.
- **VSCode**: el preview nativo soporta LaTeX vía KaTeX. Si no se ve, instala
  la extensión *Markdown+Math* o *Markdown All in One*.
- **Obsidian**: soporte nativo completo (MathJax).
- **Pandoc**: convierte directamente a LaTeX real para generar PDF, así que
  puedes usar prácticamente cualquier comando de `amsmath`.
