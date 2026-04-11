import os

file_path = 'Land Convertor/land_converter_ultimate 1.6.py'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Inject Area Calculator handling into Urdu toggle branch
# Look for where the Urdu branch reverse lookup ends
target_urdu_end = """                self.lookup_unit_cb.config(values=urdu_units)
                self.lookup_unit_var.set(urdu_units[current_unit_idx])
                self.lookup_tree.heading('Unit', text='پیمائش کی اکائی')
                self.lookup_tree.heading('Value', text='تبدیل شدہ ویلیو')
            
        else:"""

replace_urdu_end = """                self.lookup_unit_cb.config(values=urdu_units)
                self.lookup_unit_var.set(urdu_units[current_unit_idx])
                self.lookup_tree.heading('Unit', text='پیمائش کی اکائی')
                self.lookup_tree.heading('Value', text='تبدیل شدہ ویلیو')
            
                # Area Calc Tab (Urdu)
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
                        for i in range(5, 11):
                            urdu_shapes.append(f"{i} اضلاع والی شکل ({i} اضلاع + {i-3} وتر)")
                        
                        cur_shape = self.area_shape_var.get()
                        current_idx = 0
                        if cur_shape in self.area_shapes:
                            current_idx = self.area_shapes.index(cur_shape)
                        elif cur_shape in urdu_shapes:
                            current_idx = urdu_shapes.index(cur_shape)
                        
                        self.area_shape_cb.config(values=urdu_shapes)
                        self.area_shape_var.set(urdu_shapes[current_idx])
                        self.on_shape_change()
            
        else:"""
content = content.replace(target_urdu_end, replace_urdu_end)


# 2. Fix English branch area calculator toggle
target_eng_area = """                        for i in range(5, 11):
                            urdu_shapes.append(f"{i} اضلاع والی شکل ({i} اضلاع + {i-3} وتر)")
                        if cur_shape in urdu_shapes:
                            current_idx = urdu_shapes.index(cur_shape)
                        self.area_shape_cb.config(values=self.area_shapes)
                        self.area_shape_var.set(self.area_shapes[current_idx])
                        self.on_shape_change()"""

replace_eng_area = """                        for i in range(5, 11):
                            urdu_shapes.append(f"{i} اضلاع والی شکل ({i} اضلاع + {i-3} وتر)")
                        
                        if cur_shape in urdu_shapes:
                            current_idx = urdu_shapes.index(cur_shape)
                        elif cur_shape in self.area_shapes:
                            current_idx = self.area_shapes.index(cur_shape)
                            
                        self.area_shape_cb.config(values=self.area_shapes)
                        self.area_shape_var.set(self.area_shapes[current_idx])
                        self.on_shape_change()"""
content = content.replace(target_eng_area, replace_eng_area)

# 3. Inject into show_about_window
target_section3 = """        # Section 3: Legal Provisions
        self._add_section_header(scrollable_frame, "📜 Key Legal Provisions"""

replace_section3 = """        # Section 3: Advanced Tools Overview
        self._add_section_header(scrollable_frame, "🛠️ Advanced Tools Overview")
        
        tools_frame = tk.Frame(scrollable_frame, bg='#E8EAF6', relief='groove', borderwidth=2)
        tools_frame.pack(fill='x', padx=10, pady=10)
        
        tk.Label(tools_frame, text="🔍 Reverse Lookup Tool", font=('Arial', 12, 'bold'), bg='#E8EAF6', fg='#283593', anchor='w').pack(fill='x', padx=10, pady=(10, 2))
        tk.Label(tools_frame, text="Allows Patwaris to instantly convert any known measurement into all other units. For example, if you know a plot is exactly '14 Marlas (Trad)', the Reverse Lookup will tell you exactly how many Square Feet and Legal Marlas it contains. Highly useful for cross-referencing outdated records.",
                 font=('Arial', 10), bg='#E8EAF6', justify='left', wraplength=1000).pack(fill='x', padx=20, pady=(0, 10))
                 
        tk.Label(tools_frame, text="📐 Area Calculator (Survey Tool)", font=('Arial', 12, 'bold'), bg='#E8EAF6', fg='#283593', anchor='w').pack(fill='x', padx=10, pady=(5, 2))
        tk.Label(tools_frame, text="Calculate the exact square footage of any land parcel directly from the boundary side lengths. Uses the mathematically infallible Triangulation/Heron's Formula method for Polygons up to 10 sides to ensure total geometric accuracy on irregular plots. Also includes the Traditional Patwari Average Method solely for reference comparisons.",
                 font=('Arial', 10), bg='#E8EAF6', justify='left', wraplength=1000).pack(fill='x', padx=20, pady=(0, 10))

        # Section 4: Legal Provisions
        self._add_section_header(scrollable_frame, "📜 Key Legal Provisions"""
content = content.replace(target_section3, replace_section3)

target_section4 = """        # Section 4: Conversion Formulas
        self._add_section_header(scrollable_frame, "🧮 Essential Conversion Formulas"""

replace_section4 = """        # Section 5: Conversion Formulas
        self._add_section_header(scrollable_frame, "🧮 Essential Conversion Formulas"""
content = content.replace(target_section4, replace_section4)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch 3 applied")
