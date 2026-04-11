import os

file_path = 'Land Convertor/land_converter_ultimate 1.6.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target_urdu = """            if hasattr(self, 'notebook'):
                self.notebook.tab(2, text=URDU_TEXT['lookup_tab_text'])
                self.lookup_input_frame.config(text=" " + URDU_TEXT['lookup_tab_text'].strip() + " ")
                self.lookup_unit_label.config(text=URDU_TEXT['select_unit'])
                self.lookup_value_label.config(text=URDU_TEXT['enter_value'])
                self.lookup_calc_btn.config(text=URDU_TEXT['calc_btn'])
                self.lookup_results_frame.config(text=" " + URDU_TEXT['lookup_results_label'] + " ")
                
                urdu_units = ["""

replace_urdu = """            if hasattr(self, 'notebook') and self.notebook.index('end') >= 3:
                self.notebook.tab(2, text=URDU_TEXT['lookup_tab_text'])
                self.lookup_input_frame.config(text=" " + URDU_TEXT['lookup_tab_text'].strip() + " ")
                self.lookup_unit_label.config(text=URDU_TEXT['select_unit'])
                self.lookup_value_label.config(text=URDU_TEXT['enter_value'])
                self.lookup_calc_btn.config(text=URDU_TEXT['calc_btn'])
                self.lookup_results_frame.config(text=" " + URDU_TEXT['lookup_results_label'] + " ")
                
                if self.notebook.index('end') > 3:
                    self.notebook.tab(3, text=URDU_TEXT['area_calc_tab'])
                    if hasattr(self, 'area_input_frame'):
                        self.area_input_frame.config(text=" " + URDU_TEXT['area_calc_tab'].strip() + " ")
                        self.area_shape_label.config(text=URDU_TEXT['choose_shape'])
                        self.area_calc_btn.config(text=URDU_TEXT['calc_area_btn'])
                        self.area_results_frame.config(text=" " + URDU_TEXT['area_results_label'] + " ")
                        
                        urdu_shapes = [
                            URDU_TEXT['shape_rect'],
                            URDU_TEXT['shape_tri'],
                            URDU_TEXT['shape_quad_tri'],
                            URDU_TEXT['shape_quad_avg']
                        ]
                        current_idx = 0
                        cur_shape = self.area_shape_var.get()
                        if cur_shape in self.area_shapes:
                            current_idx = self.area_shapes.index(cur_shape)
                        self.area_shape_cb.config(values=urdu_shapes)
                        self.area_shape_var.set(urdu_shapes[current_idx])
                        self.on_shape_change()

                urdu_units = ["""
content = content.replace(target_urdu, replace_urdu)


methods_implementation = """
    def build_area_tab(self, parent):
        \"\"\"Build the Area Calculator tab\"\"\"
        self.area_input_frame = tk.LabelFrame(
            parent,
            text=" 📐 Survey Polygon Area Calculator ",
            font=('Arial', 15, 'bold'),
            padx=25,
            pady=20,
            bg=self.colors['white'],
            relief='groove',
            borderwidth=3
        )
        self.area_input_frame.pack(fill='x', padx=20, pady=15)
        
        row1 = tk.Frame(self.area_input_frame, bg=self.colors['white'])
        row1.pack(fill='x', pady=5)
        
        self.area_shape_label = tk.Label(
            row1,
            text="Choose Shape:",
            font=('Arial', 14, 'bold'),
            bg=self.colors['white'],
            anchor='w'
        )
        self.area_shape_label.pack(side='left', padx=(0, 10))
        
        self.area_shapes = [
            'Rectangle (Length × Width)',
            'Triangle (3 sides - Heron\\'s Formula)',
            'Quadrilateral (Exact: 4 sides + 1 diagonal)',
            'Quadrilateral (Traditional Patwari Average)'
        ]
        self.area_shape_var = tk.StringVar(value=self.area_shapes[2])
        self.area_shape_cb = ttk.Combobox(
            row1,
            textvariable=self.area_shape_var,
            values=self.area_shapes,
            font=('Arial', 13),
            width=38,
            state='readonly'
        )
        self.area_shape_cb.pack(side='left', padx=(0, 20))
        self.area_shape_cb.bind('<<ComboboxSelected>>', self.on_shape_change)
        
        # Frame for dynamic side entries
        self.side_entries_frame = tk.Frame(self.area_input_frame, bg=self.colors['white'])
        self.side_entries_frame.pack(fill='x', pady=15)
        
        self.side_vars = {}
        self.side_labels = {}
        self.side_entries = {}
        
        for i in range(1, 6): # Up to 5 inputs (4 sides + diagonal)
            frame = tk.Frame(self.side_entries_frame, bg=self.colors['white'])
            
            lbl = tk.Label(frame, text=f"Side {i}:", font=('Arial', 13, 'bold'), bg=self.colors['white'], width=18, anchor='w')
            lbl.pack(side='left', padx=5)
            self.side_labels[i] = lbl
            
            var = tk.StringVar()
            self.side_vars[i] = var
            ent = tk.Entry(frame, textvariable=var, font=('Arial', 14), width=10, justify='center', bg=self.colors['trad_yellow'], relief='solid', borderwidth=1)
            ent.pack(side='left', padx=5)
            self.side_entries[i] = ent
            
            # Pack initially hidden
            # frame.pack(side='top', fill='x', pady=3)
        
        btn_frame = tk.Frame(self.area_input_frame, bg=self.colors['white'])
        btn_frame.pack(fill='x', pady=10)
        
        self.area_calc_btn = tk.Button(
            btn_frame,
            text="🧮 Calculate Sq Ft Area",
            command=self.calculate_polygon_area,
            font=('Arial', 14, 'bold'),
            bg=self.colors['dark_blue'],
            fg=self.colors['white'],
            padx=20,
            pady=8,
            relief='raised',
            cursor='hand2'
        )
        self.area_calc_btn.pack(side='left')
        
        # Results frame
        self.area_results_frame = tk.LabelFrame(
            parent,
            text=" 📋 Area Results ",
            font=('Arial', 15, 'bold'),
            padx=20,
            pady=15,
            bg=self.colors['white'],
            relief='groove',
            borderwidth=3
        )
        self.area_results_frame.pack(fill='both', expand=True, padx=20, pady=15)
        
        res_tree_frame = tk.Frame(self.area_results_frame, bg=self.colors['white'])
        res_tree_frame.pack(fill='both', expand=True)
        
        tree_scroll_y = tk.Scrollbar(res_tree_frame, orient='vertical')
        tree_scroll_y.pack(side='right', fill='y')
        
        columns = ('Unit', 'Value')
        self.area_tree = ttk.Treeview(
            res_tree_frame,
            columns=columns,
            show='headings',
            yscrollcommand=tree_scroll_y.set,
            height=6
        )
        tree_scroll_y.config(command=self.area_tree.yview)
        self.area_tree.pack(fill='both', expand=True)
        
        self.area_tree.heading('Unit', text='Unit')
        self.area_tree.heading('Value', text='Area')
        self.area_tree.column('Unit', width=300, anchor='w')
        self.area_tree.column('Value', width=400, anchor='center')
        
        self.area_tree.tag_configure('highlight_legal', background=self.colors['light_blue'], font=('Arial', 14, 'bold'))
        self.area_tree.tag_configure('highlight_trad', background=self.colors['trad_yellow'], font=('Arial', 14, 'bold'))
        self.area_tree.tag_configure('normal_row', background=self.colors['gray'], font=('Arial', 13))
        
        self.on_shape_change()

    def on_shape_change(self, event=None):
        \"\"\"Dynamically update input fields based on selected shape\"\"\"
        shape = self.area_shape_var.get()
        is_urdu = self.is_urdu if hasattr(self, 'is_urdu') else False
        
        for frame in self.side_labels.values():
            frame.master.pack_forget()
            
        def show_input(idx, eng_label, urdu_label):
            self.side_labels[idx].config(text=urdu_label if is_urdu else eng_label)
            self.side_labels[idx].master.pack(side='top', fill='x', pady=4)

        if 'Rectangle' in shape or 'مستطیل' in shape:
            show_input(1, "Length (ft):", URDU_TEXT['side_1'] if is_urdu else "پہلا ضلع (فٹ):")
            show_input(2, "Width (ft):", URDU_TEXT['side_2'] if is_urdu else "دوسرا ضلع (فٹ):")
        elif 'Triangle' in shape or 'مثلث' in shape:
            show_input(1, "Side 1 (ft):", URDU_TEXT['side_1'] if is_urdu else "پہلا ضلع (فٹ):")
            show_input(2, "Side 2 (ft):", URDU_TEXT['side_2'] if is_urdu else "دوسرا ضلع (فٹ):")
            show_input(3, "Side 3 (ft):", URDU_TEXT['side_3'] if is_urdu else "تیسرا ضلع (فٹ):")
        elif 'Exact' in shape or 'درست' in shape:
            show_input(1, "Side 1 (ft):", URDU_TEXT['side_1'] if is_urdu else "پہلا ضلع (فٹ):")
            show_input(2, "Side 2 (ft):", URDU_TEXT['side_2'] if is_urdu else "دوسرا ضلع (فٹ):")
            show_input(3, "Side 3 (ft):", URDU_TEXT['side_3'] if is_urdu else "تیسرا ضلع (فٹ):")
            show_input(4, "Side 4 (ft):", URDU_TEXT['side_4'] if is_urdu else "چوتھا ضلع (فٹ):")
            show_input(5, "Diagonal (ft):", URDU_TEXT['diagonal'] if is_urdu else "وتر/درمیان (فٹ):")
        elif 'Average' in shape or 'اوسط' in shape:
            show_input(1, "Side 1/Opposite 1 (ft):", URDU_TEXT['side_1'] if is_urdu else "پہلا ضلع (فٹ):")
            show_input(2, "Side 2/Opposite 2 (ft):", URDU_TEXT['side_2'] if is_urdu else "دوسرا ضلع (فٹ):")
            show_input(3, "Side 3/Opposite 1 (ft):", URDU_TEXT['side_3'] if is_urdu else "تیسرا ضلع (فٹ):")
            show_input(4, "Side 4/Opposite 2 (ft):", URDU_TEXT['side_4'] if is_urdu else "چوتھا ضلع (فٹ):")

    def calculate_polygon_area(self):
        \"\"\"Calculate area based on shape and measurements\"\"\"
        shape = self.area_shape_var.get()
        sqft = 0.0
        
        try:
            def get_val(idx):
                v = self.side_vars[idx].get().strip()
                return float(v) if v else 0.0

            if 'Rectangle' in shape or 'مستطیل' in shape:
                l, w = get_val(1), get_val(2)
                sqft = l * w
            elif 'Triangle' in shape or 'مثلث' in shape:
                a, b, c = get_val(1), get_val(2), get_val(3)
                s = (a + b + c) / 2
                if s*(s-a)*(s-b)*(s-c) <= 0:
                    raise ValueError("Invalid triangle sides")
                sqft = math.sqrt(s*(s-a)*(s-b)*(s-c))
            elif 'Exact' in shape or 'درست' in shape:
                # 4 sides + diagonal. Splitting into two triangles: (a,b,diag) and (c,d,diag)
                a, b, c, d, diag = get_val(1), get_val(2), get_val(3), get_val(4), get_val(5)
                # Triangle 1
                s1 = (a + b + diag) / 2
                term1 = s1*(s1-a)*(s1-b)*(s1-diag)
                if term1 <= 0: raise ValueError("Invalid Triangle 1 sides")
                area1 = math.sqrt(term1)
                
                # Triangle 2
                s2 = (c + d + diag) / 2
                term2 = s2*(s2-c)*(s2-d)*(s2-diag)
                if term2 <= 0: raise ValueError("Invalid Triangle 2 sides")
                area2 = math.sqrt(term2)
                
                sqft = area1 + area2
            elif 'Average' in shape or 'اوسط' in shape:
                # Patwari Average: (s1+s3)/2 * (s2+s4)/2
                s1, s2, s3, s4 = get_val(1), get_val(2), get_val(3), get_val(4)
                sqft = ((s1 + s3) / 2) * ((s2 + s4) / 2)
            
            if sqft <= 0:
                raise ValueError("Area is zero or negative")
                
            # Feed sqft into conversion logic
            self.sqft_var.set(str(round(sqft, 2)))
            
            marla_legal = sqft / SQFT_PER_MARLA_LEGAL
            kanal_legal = sqft / SQFT_PER_KANAL_LEGAL
            marla_trad = sqft / SQFT_PER_MARLA_TRAD
            kanal_kpk = sqft / SQFT_PER_KANAL_TRAD
            sq_karam = sqft / SQFT_PER_SQ_KARAM
            
            for item in self.area_tree.get_children():
                self.area_tree.delete(item)
                
            is_urdu = getattr(self, 'is_urdu', False)
            if is_urdu:
                results = [
                    ('مربع فٹ', f"{sqft:,.2f}", 'normal_row'),
                    (URDU_TEXT['marla_legal'], f"{marla_legal:,.4f}", 'highlight_legal'),
                    (URDU_TEXT['kanal_legal'], f"{kanal_legal:,.4f}", 'highlight_legal'),
                    (URDU_TEXT['marla_trad'], f"{marla_trad:,.4f}", 'highlight_trad'),
                    (URDU_TEXT['kanal_kpk'], f"{kanal_kpk:,.4f}", 'highlight_trad'),
                    (URDU_TEXT['sq_karam'], f"{sq_karam:,.2f}", 'normal_row')
                ]
            else:
                results = [
                    ('Square Feet', f"{sqft:,.2f} sq ft", 'normal_row'),
                    ('Marla (Punjab Legal)', f"{marla_legal:,.4f} Marla", 'highlight_legal'),
                    ('Kanal (Punjab Legal)', f"{kanal_legal:,.4f} Kanal", 'highlight_legal'),
                    ('Marla (Trad Ref)', f"{marla_trad:,.4f} Marla", 'highlight_trad'),
                    ('Kanal (KPK Ref)', f"{kanal_kpk:,.4f} Kanal", 'highlight_trad'),
                    ('Sq. Karam', f"{sq_karam:,.2f} Sq. Karam", 'normal_row')
                ]
            
            for res_unit, res_val, tag in results:
                self.area_tree.insert('', 'end', values=(res_unit, res_val), tags=(tag,))
                
        except ValueError as e:
            msg = URDU_TEXT['invalid_number'] if getattr(self, 'is_urdu', False) else "Please enter valid measurements! Ensure triangles forms a closed shape."
            messagebox.showerror(URDU_TEXT['invalid_input'] if getattr(self, 'is_urdu', False) else "Invalid Input", msg)

"""

# Insert methods right before def add_conversion(self):
target_method = "    def add_conversion(self):"
if target_method in content:
    content = content.replace(target_method, methods_implementation + "\n" + target_method)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Patch applied")
