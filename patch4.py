import os

file_path = 'Land Convertor/land_converter_ultimate 1.6.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace the frame layout in build_area_tab
target_frame = """        # Frame for dynamic side entries
        self.side_entries_frame = tk.Frame(self.area_input_frame, bg=self.colors['white'])
        self.side_entries_frame.pack(fill='x', pady=15)"""

replace_frame = """        # Container for entries and canvas
        self.content_frame = tk.Frame(self.area_input_frame, bg=self.colors['white'])
        self.content_frame.pack(fill='both', expand=True, pady=15)
        
        # Frame for dynamic side entries (Left side)
        self.side_entries_frame = tk.Frame(self.content_frame, bg=self.colors['white'])
        self.side_entries_frame.pack(side='left', fill='both', expand=True, padx=(0, 10))
        
        # Frame for Canvas (Right side)
        self.canvas_frame = tk.Frame(self.content_frame, bg=self.colors['white'], relief='sunken', borderwidth=2)
        self.canvas_frame.pack(side='right', fill='both', padx=(10, 0))
        
        self.shape_canvas = tk.Canvas(self.canvas_frame, width=320, height=250, bg='#F0F8FF')
        self.shape_canvas.pack(padx=10, pady=10)"""
content = content.replace(target_frame, replace_frame)

# 2. Add schematic drawing call at end of on_shape_change
target_on_shape_end = """            for d in range(1, n-2):
                idx = n + d
                r = (idx-1)//4
                c = (idx-1)%4
                show_input(idx, f"Diag {d} (ft):", f"وتر {d} (فٹ):", row=r+1+(n//4), col=c)"""

replace_on_shape_end = """            for d in range(1, n-2):
                idx = n + d
                r = (idx-1)//4
                c = (idx-1)%4
                show_input(idx, f"Diag {d} (ft):", f"وتر {d} (فٹ):", row=r+1+(n//4), col=c)
                
        self._draw_shape_schematic()"""
content = content.replace(target_on_shape_end, replace_on_shape_end)

# 3. Add _draw_shape_schematic before calculate_polygon_area
target_calc = """    def calculate_polygon_area(self):
        \"\"\"Calculate area based on shape and measurements\"\"\""""

replace_calc = """    def _draw_shape_schematic(self):
        \"\"\"Draw a representative schematic on the canvas\"\"\"
        if not hasattr(self, 'shape_canvas'):
            return
            
        self.shape_canvas.delete("all")
        shape = self.area_shape_var.get()
        w = 320
        h = 250
        cx = w / 2
        cy = h / 2
        radius = min(w, h) / 2 - 30
        
        def draw_label(x1, y1, x2, y2, text, color='blue', offset=15):
            mx, my = (x1 + x2) / 2, (y1 + y2) / 2
            dx, dy = mx - cx, my - cy
            dist = math.hypot(dx, dy)
            if dist > 0:
                nx, ny = dx/dist, dy/dist
                lx, ly = mx + nx*offset, my + ny*offset
            else:
                lx, ly = mx, my
            self.shape_canvas.create_text(lx, ly, text=text, fill=color, font=('Arial', 10, 'bold'))

        if 'Rectangle' in shape or 'مستطیل' in shape:
            pts = [(cx-80, cy-50), (cx+80, cy-50), (cx+80, cy+50), (cx-80, cy+50)]
            self.shape_canvas.create_polygon(pts, fill='#E3F2FD', outline='#1565C0', width=2)
            draw_label(pts[0][0], pts[0][1], pts[1][0], pts[1][1], "Side 2 (W)")
            draw_label(pts[1][0], pts[1][1], pts[2][0], pts[2][1], "Side 1 (L)")
            draw_label(pts[2][0], pts[2][1], pts[3][0], pts[3][1], "Side 2 (W)")
            draw_label(pts[3][0], pts[3][1], pts[0][0], pts[0][1], "Side 1 (L)")
            
        elif 'Triangle' in shape or 'مثلث' in shape:
            pts = [(cx, cy-radius), (cx+radius*0.866, cy+radius*0.5), (cx-radius*0.866, cy+radius*0.5)]
            self.shape_canvas.create_polygon(pts, fill='#E3F2FD', outline='#1565C0', width=2)
            draw_label(pts[0][0], pts[0][1], pts[1][0], pts[1][1], "S2")
            draw_label(pts[1][0], pts[1][1], pts[2][0], pts[2][1], "S3")
            draw_label(pts[2][0], pts[2][1], pts[0][0], pts[0][1], "S1")
            
        elif 'Exact' in shape or 'درست' in shape:
            pts = [(cx-radius*0.7, cy-radius*0.7), (cx+radius*0.7, cy-radius*0.5), 
                   (cx+radius*0.5, cy+radius*0.8), (cx-radius*0.8, cy+radius*0.5)]
            self.shape_canvas.create_polygon(pts, fill='#E3F2FD', outline='#1565C0', width=2)
            self.shape_canvas.create_line(pts[0][0], pts[0][1], pts[2][0], pts[2][1], fill='red', dash=(4,4), width=2)
            draw_label(pts[0][0], pts[0][1], pts[1][0], pts[1][1], "S1")
            draw_label(pts[1][0], pts[1][1], pts[2][0], pts[2][1], "S2")
            draw_label(pts[2][0], pts[2][1], pts[3][0], pts[3][1], "S3")
            draw_label(pts[3][0], pts[3][1], pts[0][0], pts[0][1], "S4")
            draw_label(pts[0][0], pts[0][1], pts[2][0], pts[2][1], "Diag", color='red', offset=0)
            
        elif 'Average' in shape or 'اوسط' in shape:
            pts = [(cx-radius*0.7, cy-radius*0.7), (cx+radius*0.7, cy-radius*0.5), 
                   (cx+radius*0.5, cy+radius*0.8), (cx-radius*0.8, cy+radius*0.5)]
            self.shape_canvas.create_polygon(pts, fill='#FFF8E1', outline='#F57F17', width=2)
            draw_label(pts[0][0], pts[0][1], pts[1][0], pts[1][1], "S1")
            draw_label(pts[1][0], pts[1][1], pts[2][0], pts[2][1], "S2")
            draw_label(pts[2][0], pts[2][1], pts[3][0], pts[3][1], "S3 (Opp 1)")
            draw_label(pts[3][0], pts[3][1], pts[0][0], pts[0][1], "S4 (Opp 2)")
            
        elif '-Sided' in shape or 'اضلاع' in shape:
            import re, math
            m = re.search(r'(\d+)-Sided', shape)
            if not m: m = re.search(r'(\d+)', shape)
            n = int(m.group(1)) if m else 5
            
            pts = []
            for i in range(n):
                angle = 2 * math.pi * i / n - math.pi/2
                px = cx + radius * math.cos(angle)
                py = cy + radius * math.sin(angle)
                pts.append((px, py))
            
            self.shape_canvas.create_polygon(pts, fill='#E8F5E9', outline='#2E7D32', width=2)
            
            for i in range(n):
                p1 = pts[i]
                p2 = pts[(i+1)%n]
                draw_label(p1[0], p1[1], p2[0], p2[1], f"S{i+1}")
                
            for i in range(n-3):
                p1 = pts[0]
                p2 = pts[i+2]
                self.shape_canvas.create_line(p1[0], p1[1], p2[0], p2[1], fill='red', dash=(4,4), width=2)
                draw_label(p1[0], p1[1], p2[0], p2[1], f"D{i+1}", color='red', offset=0)

    def calculate_polygon_area(self):
        \"\"\"Calculate area based on shape and measurements\"\"\""""
content = content.replace(target_calc, replace_calc)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch 4 applied - Drawing Logic injected")
